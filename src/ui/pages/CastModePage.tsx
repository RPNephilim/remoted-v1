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
            console.log('Remote stream tracks:', remoteStream.getTracks().map(t => `${t.kind}: ${t.enabled}`));
            remoteVideoRef.current.srcObject = remoteStream;
            
            // Try to play the video
            remoteVideoRef.current.play().catch(err => {
                console.error('Error playing video:', err);
            });
        }

        return () => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null;
            }
        }
    }, [remoteStream]);

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