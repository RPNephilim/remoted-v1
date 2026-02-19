import properties from '../data/properties.json';
import { getPeerConnection } from '../contexts/PeerConnectionContext';


declare global {
    interface Window {
        require: any;
    }
}

class PeerConnection {
    private peerId: string;
    private userId: string;

    constructor() {
        this.peerId = '';
        this.userId = '';
    }

    // Establish a connection with the signaling server and register the user
    registerUser(userId: string) {
        this.userId = userId;
        const signalingServerUrl = properties.signalingServerUrl + '/' + this.userId;
        const serverConnection = new WebSocket(signalingServerUrl);

        serverConnection.onopen = () => {
            console.log('Connected to signaling server');
        };

        serverConnection.onmessage = async (message) => {
            const response = JSON.parse(message.data);
            console.log('Received message from signaling server:', response);

            if (response.type === 'offer') {
                await this.handleOffer(response);
            } else if (response.type === 'answer') {
                await this.handleAnswer(response);
            } else if (response.type === 'ice-candidate') {
                await this.handleIceCandidate(response);
            }
        };

        serverConnection.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    establishPeerConnection(peerId: string, connectionMode: string) {
        this.peerId = peerId;
        console.log(`Establishing connection with peer ${this.peerId}, in mode ${connectionMode}`);
        switch (connectionMode) {
            case "browse":
                // Handle browse mode specific logic
                this.establishBrowseConnection();
                break;
            case "control":
                // Handle control mode specific logic
                this.establishControlConnection();
                break;
            case "cast":
                // Handle cast mode specific logic
                this.establishCastConnection();
                break;
        }
    }

    private async establishBrowseConnection() {
        // Implement browse mode specific connection logic here
        const { ipcRenderer } = window.require('electron');

        await ipcRenderer.invoke('set-connection-mode', 'browse');
        console.log('Set connection mode to browse in main process');
    }

    private async establishControlConnection() {
        // Implement control mode specific connection logic here

        const { ipcRenderer } = window.require('electron');

        await ipcRenderer.invoke('set-connection-mode', 'control');
        console.log('Set connection mode to control in main process');
    }

    private async establishCastConnection() {

        const { ipcRenderer } = window.require('electron');

        await ipcRenderer.invoke('set-connection-mode', 'cast');
        console.log('Set connection mode to cast in main process');

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

        const { serverConnection, peerConnection, setLocalStream } = getPeerConnection();
        const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        console.log('User media selected');

        // Add tracks with encoding parameters for better quality
        stream.getTracks().forEach(track => {
            const sender = peerConnection!.addTrack(track, stream);

            // Configure encoding parameters for video tracks
            if (track.kind === 'video') {
                const params = sender.getParameters();
                if (!params.encodings) {
                    params.encodings = [{}];
                }
                // Set high bitrate for smooth 1080p60 - adjust based on network
                params.encodings[0].maxBitrate = 8000000; // 8 Mbps
                params.encodings[0].maxFramerate = 60;
                sender.setParameters(params).catch(err => console.error('Error setting encoding params:', err));
            }
        })
        setLocalStream(stream);

        const offer = await peerConnection!.createOffer();
        await peerConnection!.setLocalDescription(offer);
        console.log(`userId: ${this.userId}, peerId: ${this.peerId}`)

        if (serverConnection) {
            const payload = {
                type: 'offer',
                from: this.userId,
                to: this.peerId,
                data: offer
            }
            serverConnection.send(JSON.stringify(payload));
            console.log('Sent negotiation offer')
        }

    }

    private async handleOffer(message: any) {
        console.log('Received offer:', message.data);

        const { serverConnection, setPeerId, setPeerConnection, setRemoteStream, setDataChannel } = getPeerConnection();

        // Initial offer - create new peer connection
        console.log('Handling initial offer');

        // Set the target peer ID to the peer who sent the offer
        setPeerId(message.from);

        const pc = new RTCPeerConnection(properties.configuration);
        setPeerConnection(pc);

        console.log('Created RTCPeerConnection for incoming offer');

        pc.onicecandidate = (event) => {
            if (event.candidate && serverConnection) {
                const response = {
                    type: 'ice-candidate',
                    from: this.userId,
                    to: message.from,
                    data: event.candidate
                };
                serverConnection.send(JSON.stringify(response));
            }
        };

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'connected') {
                // setStatus('Peers connected!');
            }
        };

        pc.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        }

        pc.ondatachannel = (event) => {
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

        await pc.setRemoteDescription(new RTCSessionDescription(message.data));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        console.log('Created and set local description with answer');

        // Send the answer back to the offering peer
        console.log('Sending answer back to peer: ', message.from);
        if (serverConnection) {
            const response = {
                type: 'answer',
                from: this.userId,
                to: message.from,
                data: answer
            };
            serverConnection.send(JSON.stringify(response));
        } else {
            console.error('No connection to signaling server');
        }
        console.log('Sent answer back to offering peer');
    }

    private async handleAnswer(message: any) {
        const { peerConnection } = getPeerConnection();
        console.log('Received answer:', message.data);
        if (peerConnection) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message.data));
        }
    }

    private async handleIceCandidate(message: any) {
        const { peerConnection } = getPeerConnection();
        console.log('Received ICE candidate:', message.data);
        if (peerConnection && message.data) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(message.data));
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        }
    }
}

export default PeerConnection;