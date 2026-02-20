import { useEffect } from "react";
import { usePeerConnection } from "../contexts/PeerConnectionContext";
import { establishCastConnection } from "../peerconnection/PeerConnectionService";
import { Button } from "@mui/material";

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
    }, []);

    const castMedia = () => {
        establishCastConnection({
            userId, peerId, connectionMode, serverConnection, peerConnection, localStream, remoteStream, dataChannel,
            setUserId, setPeerId, setConnectionMode, setServerConnection, setPeerConnection, setLocalStream, setRemoteStream, setDataChannel
        });
        console.log(`Established peer connection for user ${userId} in Cast mode with peer ID ${peerId}`);
    }
    return (
        <>
            <div className="cast-mode-page-div">
                <h1>Cast Page</h1>
                <Button variant="contained" color="primary" onClick={() => castMedia()}>Choose Media to Cast</Button>
            </div>

        </>
    )
}

export default CastModePage;