import { useEffect } from "react";
import { getPeerConnection } from "../contexts/PeerConnectionContext";
import PeerConnection from "../peerconnection/PeerConnection";

function BrowseModePage() {
    const { userId, peerId, connectionMode } = getPeerConnection();

    const peerConnection = new PeerConnection();
    const isBrowseMode = connectionMode === "browse";

    useEffect(() => {
        if (!isBrowseMode) {
            console.warn("Not in browse mode, skipping peer connection establishment");
            return;
        }
        peerConnection.registerUser(userId);
        console.log(`Registered user ${userId} with signaling server`);
        
        peerConnection.establishPeerConnection(peerId, connectionMode);
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