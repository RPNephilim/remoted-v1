import { useEffect, useRef } from "react";
import { usePeerConnectionRef } from "../hooks/usePeerConnectionRef";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function CastModePage() {
    const { remoteStream, castRole, peerConnection, localStream, setCastRole, setLocalStream, setPeerConnection, setRemoteStream } = usePeerConnectionRef();
    const navigate = useNavigate();

    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            console.log('Setting remote stream to video element:', remoteStream.id);
            const tracks = remoteStream.getTracks();
            console.log('Remote stream tracks:', tracks.map(t => ({
                kind: t.kind,
                enabled: t.enabled,
                readyState: t.readyState,
                muted: t.muted,
                id: t.id
            })));
            
            const videoElement = remoteVideoRef.current;
            videoElement.srcObject = remoteStream;
            
            // Add event listeners for debugging
            videoElement.onloadstart = () => console.log('Video: loadstart');
            videoElement.onloadedmetadata = () => console.log('Video: loadedmetadata', videoElement.videoWidth, 'x', videoElement.videoHeight);
            videoElement.onloadeddata = () => console.log('Video: loadeddata');
            videoElement.oncanplay = () => console.log('Video: canplay');
            videoElement.onplay = () => console.log('Video: playing');
            videoElement.onerror = (e) => console.error('Video error:', e);
            videoElement.onstalled = () => console.warn('Video: stalled');
            videoElement.onwaiting = () => console.warn('Video: waiting');
            
            // Monitor connection state
            if (peerConnection) {
                console.log('PeerConnection state:', peerConnection.connectionState);
                console.log('ICE connection state:', peerConnection.iceConnectionState);
            }
            
            return () => {
                videoElement.srcObject = null;
            };
        }

        return () => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null;
            }
        }
    }, [remoteStream, peerConnection]);

    const stopCasting = () => {
        // Stop all tracks in local stream
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        
        // Close peer connection
        if (peerConnection) {
            peerConnection.close();
            setPeerConnection(null);
        }
        
        // Clear remote stream
        setRemoteStream(null);
        
        // Clear cast role
        setCastRole(null);
        
        // Navigate back to mode select
        navigate('/mode-select');
    };

    return (
        <>
            <div className="cast-mode-page-div">
                <h1>Cast Page</h1>
                
                {castRole === 'caster' && (
                    <div>
                        <p>You are casting your screen to the remote peer</p>
                        <Button variant="contained" color="error" onClick={stopCasting}>
                            Stop Casting
                        </Button>
                    </div>
                )}
                
                {castRole === 'receiver' && remoteStream && (
                    <div>
                        <p>Receiving screen from remote peer</p>
                        <video 
                            ref={remoteVideoRef} 
                            width={1280} 
                            height={720} 
                            autoPlay 
                            playsInline 
                            muted
                            controls 
                        />
                    </div>
                )}
                
                {castRole === 'receiver' && !remoteStream && (
                    <div>
                        <p>Waiting for remote stream...</p>
                    </div>
                )}
            </div>
        </>
    )
}

export default CastModePage;