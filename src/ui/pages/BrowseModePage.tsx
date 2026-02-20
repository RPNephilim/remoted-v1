import { useEffect } from "react";
import { usePeerConnection } from "../contexts/PeerConnectionContext";
import { establishPeerConnection } from "../peerconnection/PeerConnectionService";

function BrowseModePage() {
     const {
        userId, peerId, connectionMode, serverConnection, peerConnection, localStream, remoteStream, dataChannel,
        setUserId, setPeerId, setConnectionMode, setServerConnection, setPeerConnection, setLocalStream, setRemoteStream, setDataChannel
    } = usePeerConnection();

    const isBrowseMode = connectionMode === "browse";

    useEffect(() => {
        if (!isBrowseMode) {
            console.warn("Not in browse mode, skipping peer connection establishment");
            return;
        }
        
        establishPeerConnection({
            userId, peerId, connectionMode, serverConnection, peerConnection, localStream, remoteStream, dataChannel,
            setUserId, setPeerId, setConnectionMode, setServerConnection, setPeerConnection, setLocalStream, setRemoteStream, setDataChannel
        });
        console.log(`Established peer connection for user ${userId} in Browse mode with peer ID ${peerId}`);
    }, []);
    
    return (
        <>
            <div className="browse-mode-page-div">

            </div>

        </>
    )
}

export default BrowseModePage;