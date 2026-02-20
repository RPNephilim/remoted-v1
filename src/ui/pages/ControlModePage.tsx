import { useEffect } from "react";
import { usePeerConnection } from "../contexts/PeerConnectionContext";
import { establishPeerConnection } from "../peerconnection/PeerConnectionService";

function ControlModePage() {
     const {
        userId, peerId, connectionMode, serverConnection, peerConnection, localStream, remoteStream, dataChannel,
        setUserId, setPeerId, setConnectionMode, setServerConnection, setPeerConnection, setLocalStream, setRemoteStream, setDataChannel
    } = usePeerConnection();

    const isControlMode = connectionMode === "control";

    useEffect(() => {
        if (!isControlMode) {
            console.warn("Not in control mode, skipping peer connection establishment");
            return;
        }

        establishPeerConnection({
            userId, peerId, connectionMode, serverConnection, peerConnection, localStream, remoteStream, dataChannel,
            setUserId, setPeerId, setConnectionMode, setServerConnection, setPeerConnection, setLocalStream, setRemoteStream, setDataChannel
        });
        console.log(`Established peer connection for user ${userId} in Control mode with peer ID ${peerId}`);
    }, []);

    return (
        <>
            <div className="control-mode-page-div">
                
            </div>

        </>
    )
}
export default ControlModePage;