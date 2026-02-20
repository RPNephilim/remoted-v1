import { useEffect } from "react";
import { usePeerConnection } from "../contexts/PeerConnectionContext";
import { establishPeerConnection } from "../peerconnection/PeerConnectionService";

function CastModePage() {
    const { userId, peerId, connectionMode } = usePeerConnection();

    const isCastMode = connectionMode === "cast";

    // Run peer connection establishment logic when the component mounts, but only if we're in Cast mode
    useEffect(() => {
        if (!isCastMode) {
            console.warn("Not in Cast mode, skipping peer connection establishment");
            return;
        }

        establishPeerConnection(peerId, connectionMode);
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