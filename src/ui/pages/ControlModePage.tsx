import { useEffect } from "react";
import { usePeerConnection } from "../contexts/PeerConnectionContext";
import { establishPeerConnection } from "../peerconnection/PeerConnectionService";

function ControlModePage() {
    const { userId, peerId, connectionMode } = usePeerConnection();

    const isControlMode = connectionMode === "control";

    useEffect(() => {
        if (!isControlMode) {
            console.warn("Not in control mode, skipping peer connection establishment");
            return;
        }

        establishPeerConnection(peerId, connectionMode);
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