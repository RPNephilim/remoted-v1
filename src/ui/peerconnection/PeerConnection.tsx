import properties from '../data/properties.json';
import { getPeerConnection } from '../contexts/PeerConnectionContext';

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

    private establishBrowseConnection() {
        // Implement browse mode specific connection logic here
    }

    private establishControlConnection() {
        // Implement control mode specific connection logic here
    }

    private async establishCastConnection() {
        // Implement cast mode specific connection logic here
        const displayMediaOptions = {

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
            console.log('Sent renegotiation offer')
        }

    }

    private async handleOffer(offer: string) {

    }

    private async handleAnswer(answer: string) {

    }

    private async handleIceCandidate(candidate: string) {

    }
}

export default PeerConnection;