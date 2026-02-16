import { useEffect } from "react";
import { getPeerConnection } from "../contexts/PeerConnectionContext";
import PeerConnection from "../peerconnection/PeerConnection";

function CastModePage() {
    const { userId, peerId, connectionMode } = getPeerConnection();

    const peerConnection = new PeerConnection();
    const isCastMode = connectionMode === "cast";

    // Run peer connection establishment logic when the component mounts, but only if we're in Cast mode
    useEffect(() => {
        if (!isCastMode) {
            console.warn("Not in Cast mode, skipping peer connection establishment");
            return;
        }
        peerConnection.registerUser(userId);
        console.log(`Registered user ${userId} with signaling server`);

        peerConnection.establishPeerConnection(peerId, connectionMode);
        console.log(`Established peer connection for user ${userId} with peer ID ${peerId}`);
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