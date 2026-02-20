import properties from '../data/properties.json';

declare global {
    interface Window {
        electronAPI: {
            setConnectionMode: (mode: string) => Promise<any>;
        };
    }
}


// Establish a connection with the signaling server and register the user
export const registerUser = (context: any) => {
    const { userId, setServerConnection } = context;
    const signalingServerUrl = properties.signalingServerUrl;
    const serverConnection = new WebSocket(signalingServerUrl);

    serverConnection.onopen = () => {
        console.log('Connected to signaling server');
        
        // Send a registration message to the signaling server with the user ID
        const registrationMessage = {
            type: 'register',
            from: userId
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


    setServerConnection(serverConnection);
    console.log('serverConnection updated with WebSocket connection');
}

export const establishPeerConnection = (context: any) => {
    const { peerId, connectionMode } = context;

    console.log(`Establishing connection with peer ${peerId}, in mode ${connectionMode}`);
    switch (connectionMode) {
        case "browse":
            // Handle browse mode specific logic
            establishBrowseConnection();
            break;
        case "control":
            // Handle control mode specific logic
            establishControlConnection();
            break;
        case "cast":
            // Handle cast mode specific logic
            establishCastConnection(context);
            break;
    }
}

const establishBrowseConnection = async () => {
    // Implement browse mode specific connection logic here
    await window.electronAPI.setConnectionMode('browse');
    console.log('Set connection mode to browse in main process');
}

const establishControlConnection = async () => {
    // Implement control mode specific connection logic here
    await window.electronAPI.setConnectionMode('control');
    console.log('Set connection mode to control in main process');
}

const establishCastConnection = async (context: any) => {
    const { userId, peerId, serverConnection, setRemoteStream, setPeerConnection } = context;

    await window.electronAPI.setConnectionMode('cast');
    console.log('Set connection mode to cast in main process');

    const peerConnection = new RTCPeerConnection(properties.configuration);
    peerConnection.onicecandidate = (event) => {
        if (event.candidate && serverConnection) {
          const message = {
            type: 'ice-candidate',
            from: userId,
            to: peerId,
            data: event.candidate
          };
          serverConnection.send(JSON.stringify(message));
        }
    };

    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === 'connected') {
        console.log('Peers connected!');
      }
    };

    peerConnection.ontrack = (event) => {
      console.log('🎥 [connectWithPeer] Received remote track:', event.track.kind, 'from stream:', event.streams[0].id);
      setRemoteStream(event.streams[0]);
    };

    setPeerConnection(peerConnection);

    // Implement cast mode specific connection logic here
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
    console.log(`userId: ${userId}, peerId: ${peerId}`)

    if (serverConnection) {
        const payload = {
            type: 'offer',
            from: userId,
            to: peerId,
            data: offer
        }
        serverConnection.send(JSON.stringify(payload));
        console.log('Sent negotiation offer')
    }

}
const handleOffer = async (message: any, context: any) => {
    console.log('Received offer:', message.data);

    const { userId, serverConnection, setPeerId, setPeerConnection, setRemoteStream, setDataChannel } = context;

    // Initial offer - create new peer connection
    console.log('Handling initial offer');

    // Set the target peer ID to the peer who sent the offer
    setPeerId(message.from);

    const peerConnection = new RTCPeerConnection(properties.configuration);
    setPeerConnection(peerConnection);

    console.log('Created RTCPeerConnection for incoming offer');

    peerConnection.onicecandidate = (event) => {
        if (event.candidate && serverConnection) {
            const response = {
                type: 'ice-candidate',
                from: userId,
                to: message.from,
                data: event.candidate
            };
            serverConnection.send(JSON.stringify(response));
        }
    };

    peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === 'connected') {
            // setStatus('Peers connected!');
        }
    };

    peerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
    }

    peerConnection.ondatachannel = (event) => {
        const dataChannel = event.channel;
        dataChannel.onopen = () => {
            console.log('Data channel is open');
            setDataChannel(dataChannel);
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
    if (serverConnection) {
        const payload = {
            type: 'answer',
            from: userId,
            to: message.from,
            data: answer
        };
        serverConnection.send(JSON.stringify(payload));
    } else {
        console.error('No connection to signaling server');
    }
    console.log('Sent answer back to offering peer');
}
const handleAnswer = async (message: any, context: any) => {
    const { peerConnection } = context;
    console.log('Received answer:', message.data);
    if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(message.data));
    }
}

const handleIceCandidate = async (message: any, context: any) => {
    const { peerConnection } = context;
    console.log('Received ICE candidate:', message.data);
    if (peerConnection && message.data) {
        try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(message.data));
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    }
}
