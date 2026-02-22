import { ConnectionState } from '../data/ConnectionState';
import properties from '../data/properties.json';

declare global {
    interface Window {
        electronAPI?: {
            setConnectionMode: (mode: string) => Promise<any>;
        };
    }
}


// Establish a connection with the signaling server and register the user
export const registerUser = (context: any) => {
    const { getConnection, updateConnection } = context;
    const connection = getConnection();
    const signalingServerUrl = properties.signalingServerUrl;
    const serverConnection = new WebSocket(signalingServerUrl);

    serverConnection.onopen = () => {
        console.log('Connected to signaling server');
        updateConnection({ serverConnection: serverConnection, connectionState: ConnectionState.USER_CONNECTED });
        console.log('serverConnection updated with WebSocket connection');
        // Send a registration message to the signaling server with the user ID
        const registrationMessage = {
            type: 'register',
            from: connection.userId
        };
        serverConnection.send(JSON.stringify(registrationMessage));
        console.log('Sent registration message to signaling server:', registrationMessage);
    };

    serverConnection.onmessage = async (message) => {
        const response = JSON.parse(message.data);
        console.log('Received message from signaling server:', response);

        if (response.type === 'offer') {
            await handleOffer(response, context);
        } else if (response.type === 'answer') {
            await handleAnswer(response, context);
        } else if (response.type === 'ice-candidate') {
            await handleIceCandidate(response, context);
        } else if (response.type === 'peer-registered') {
            console.log("Successfully registered Peer!!!");
        }
    };

    serverConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

}

export const establishPeerConnection = async (context: any) => {
    const { getConnection } = context;
    const connection = getConnection();
    const { peerId, connectionMode } = connection;

    console.log(`Establishing connection with peer ${peerId}, in mode ${connectionMode}`);
    switch (connectionMode) {
        case "browse":
            // Handle browse mode specific logic
            await establishBrowseConnection();
            break;
        case "control":
            // Handle control mode specific logic
            await establishControlConnection();
            break;
        case "cast":
            // Handle cast mode specific logic
            await establishCastConnection(context);
            break;
    }
}

const establishBrowseConnection = async () => {
    // Implement browse mode specific connection logic here
    if (window.electronAPI) {
        await window.electronAPI.setConnectionMode('browse');
        console.log('Set connection mode to browse in main process');
    } else {
        console.log('Running in browser mode - Electron API not available');
    }
}

const establishControlConnection = async () => {
    // Implement control mode specific connection logic here
    if (window.electronAPI) {
        await window.electronAPI.setConnectionMode('control');
        console.log('Set connection mode to control in main process');
    } else {
        console.log('Running in browser mode - Electron API not available');
    }
}

export const establishCastConnection = async (context: any) => {
    const { getConnection, updateConnection } = context;
    const connection = getConnection();

    // Set Electron mode if available (non-blocking to preserve user gesture)
    if (window.electronAPI) {
        window.electronAPI.setConnectionMode('cast').then(() => {
            console.log('Set connection mode to cast in main process');
        });
    } else {
        console.log('Running in browser mode - Electron API not available');
    }

    // Call getDisplayMedia FIRST to preserve user gesture chain
    const displayMediaOptions = {
        audio: true,
        video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 60, max: 60 },
            latency: 0
        }
    }
    const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    console.log('User media selected');
    
    // Store the local stream so we can stop it later
    updateConnection({ localStream: stream });

    const peerConnection = new RTCPeerConnection(properties.configuration);
    peerConnection.onicecandidate = (event) => {
        if (event.candidate && connection.serverConnection) {
          const message = {
            type: 'ice-candidate',
            from: connection.userId,
            to: connection.peerId,
            data: event.candidate
          };
          connection.serverConnection.send(JSON.stringify(message));
        }
    };

    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === 'connected') {
        console.log('Peers connected!');
      }
    };

    peerConnection.ontrack = (event) => {
      console.log('🎥 [connectWithPeer] Received remote track:', event.track.kind, 'from stream:', event.streams[0].id);
      updateConnection({ remoteStream: event.streams[0] });
    };

    updateConnection({ peerConnection: peerConnection });

    // Add tracks with encoding parameters for better quality
    stream.getTracks().forEach(track => {
        const sender = peerConnection!.addTrack(track, stream);

        // Configure encoding parameters for video tracks
        if (track.kind === 'video') {
            (track as any).contentHint = 'motion'; // Hint for screen sharing
            const params = sender.getParameters();
            if (!params.encodings) {
                params.encodings = [{}];
            }
            // Set high bitrate for smooth 1080p60 - adjust based on network
            params.encodings[0].maxBitrate = 8000000; // 8 Mbps
            params.encodings[0].maxFramerate = 60;
            sender.setParameters(params).catch(err => console.error('Error setting encoding params:', err));
        }
    });

    const offer = await peerConnection!.createOffer();
    await peerConnection!.setLocalDescription(offer);
    console.log(`userId: ${connection.userId}, peerId: ${connection.peerId}`)

    if (connection.serverConnection) {
        const payload = {
            type: 'offer',
            from: connection.userId,
            to: connection.peerId,
            data: offer
        }
        connection.serverConnection.send(JSON.stringify(payload));
        console.log('Sent negotiation offer')
        updateConnection({ connectionMode: 'cast-send' });
    }

}
const handleOffer = async (message: any, context: any) => {
    console.log('Received offer:', message.data);

    const { getConnection, updateConnection } = context;
    const connection = getConnection();

    // Initial offer - create new peer connection
    console.log('Handling initial offer');

    // Set the target peer ID to the peer who sent the offer
    updateConnection({ peerId: message.from });
    
    // Navigate to cast page (using window location to trigger route change)
    // window.location.hash = '/cast';

    const peerConnection = new RTCPeerConnection(properties.configuration);
    updateConnection({ peerConnection: peerConnection });

    console.log('Created RTCPeerConnection for incoming offer');

    peerConnection.onicecandidate = (event) => {
        if (event.candidate && connection.serverConnection) {
            const response = {
                type: 'ice-candidate',
                from: connection.userId,
                to: message.from,
                data: event.candidate
            };
            connection.serverConnection.send(JSON.stringify(response));
        }
    };

    peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === 'connected') {
            // setStatus('Peers connected!');
            console.log('Peers connected!');
            updateConnection({ connectionState: 'cast-receive' });
        }
    };

    peerConnection.ontrack = (event) => {
        console.log('🎥 [handleOffer] Received remote track:', event.track.kind, 'from stream:', event.streams[0].id);
        console.log('Stream track count:', event.streams[0].getTracks().length);
        updateConnection({ remoteStream: event.streams[0] });
        updateConnection({ connectionState: 'cast-receive' });
    }

    peerConnection.ondatachannel = (event) => {
        const dataChannel = event.channel;
        dataChannel.onopen = () => {
            console.log('Data channel is open');
            updateConnection({ dataChannel: dataChannel });
        };
        dataChannel.onclose = () => {
            console.warn('⚠️ Data channel CLOSED');
        };
        dataChannel.onerror = (error) => {
            console.error('❌ Data channel ERROR:', error);
        };
        dataChannel.onmessage = (event) => {
            console.log('[Responder] Received message:', event.data);
        };
    }

    await peerConnection.setRemoteDescription(new RTCSessionDescription(message.data));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    console.log('Created and set local description with answer');

    // Send the answer back to the offering peer
    console.log('Sending answer back to peer: ', message.from);
    if (connection.serverConnection) {
        const payload = {
            type: 'answer',
            from: connection.userId,
            to: message.from,
            data: answer
        };
        connection.serverConnection.send(JSON.stringify(payload));
        console.log('Sent answer back to offering peer');
    } else {
        console.error('No connection to signaling server');
    }
    
}
const handleAnswer = async (message: any, context: any) => {
    const { getConnection } = context;
    const connection = getConnection();
    const peerConnection = connection.peerConnection;
    console.log('Received answer:', message.data);
    if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(message.data));
    }
}

const handleIceCandidate = async (message: any, context: any) => {
    const { getConnection } = context;
    const connection = getConnection();
    const peerConnection = connection.peerConnection;
    console.log('Received ICE candidate:', message.data);
    if (peerConnection && message.data) {
        try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(message.data));
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    }
}
