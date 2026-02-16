import { useEffect } from "react";
import { getPeerConnection } from "../contexts/PeerConnectionContext";
import PeerConnection from "../peerconnection/PeerConnection";

function ControlModePage() {
    const { userId, peerId, connectionMode } = getPeerConnection();

    const peerConnection = new PeerConnection();
    const isControlMode = connectionMode === "control";

    useEffect(() => {
        if (!isControlMode) {
            console.warn("Not in control mode, skipping peer connection establishment");
            return;
        }
        peerConnection.registerUser(userId);
        console.log(`Registered user ${userId} with signaling server`);

        peerConnection.establishPeerConnection(peerId, connectionMode);
        console.log(`Established peer connection for user ${userId} with peer ID ${peerId}`);
    }, []);

    return (
        <>
            <div className="control-mode-page-div">
                
            </div>

        </>
    )
}
export default ControlModePage;