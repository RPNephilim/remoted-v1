import { useEffect } from "react";
import { usePeerConnection } from "../contexts/PeerConnectionContext";
import { establishPeerConnection } from "../peerconnection/PeerConnectionService";

function BrowseModePage() {
    const { userId, peerId, connectionMode } = usePeerConnection();

    const isBrowseMode = connectionMode === "browse";

    useEffect(() => {
        if (!isBrowseMode) {
            console.warn("Not in browse mode, skipping peer connection establishment");
            return;
        }
        
        establishPeerConnection(peerId, connectionMode);
        console.log(`Established peer connection for user ${userId} with peer ID ${peerId}`);
    }, []);
    
    return (
        <>
            <div className="browse-mode-page-div">

            </div>

        </>
    )
}

export default BrowseModePage;