import { useEffect, useRef } from "react";
import { usePeerConnection } from "../contexts/PeerConnectionContext";

function CastModePage() {
    const context = usePeerConnection();
    const { remoteStream } = context;

    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }

        return () => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null;
            }
        }
    }, [remoteStream]);

    return (
        <>
            {remoteStream && <div className="cast-mode-page-div">
                <h1>Cast Page</h1>
                <video ref={remoteVideoRef} width={480} height={360} autoPlay playsInline controls />
            </div>}

        </>
    )
}

export default CastModePage;