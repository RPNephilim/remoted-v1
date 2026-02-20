import { useEffect } from "react";
import { usePeerConnection } from "../contexts/PeerConnectionContext";
import { establishPeerConnection } from "../peerconnection/PeerConnectionService";

function CastModePage() {
    const {
        userId, peerId, connectionMode, serverConnection, peerConnection, localStream, remoteStream, dataChannel,
        setUserId, setPeerId, setConnectionMode, setServerConnection, setPeerConnection, setLocalStream, setRemoteStream, setDataChannel
    } = usePeerConnection();

    const isCastMode = connectionMode === "cast";

    // Run peer connection establishment logic when the component mounts, but only if we're in Cast mode
    useEffect(() => {
        if (!isCastMode) {
            console.warn("Not in Cast mode, skipping peer connection establishment");
            return;
        }

        establishPeerConnection({
            userId, peerId, connectionMode, serverConnection, peerConnection, localStream, remoteStream, dataChannel,
            setUserId, setPeerId, setConnectionMode, setServerConnection, setPeerConnection, setLocalStream, setRemoteStream, setDataChannel
        });
        console.log(`Established peer connection for user ${userId} in Cast mode with peer ID ${peerId}`);
    }, []);

    return (
        <>
            <div className="cast-mode-page-div">
                <h1>Cast Page</h1>
            </div>

        </>
    )
}

export default CastModePage;