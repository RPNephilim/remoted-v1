import { getPeerConnection } from "../contexts/PeerConnectionContext";

function ControlModePage() {
    const { userId, peerId } = getPeerConnection();
    return(
        <>
            <h1>Control Page</h1>
            <p>{userId}{peerId}</p>
        </>
    )
}
export default ControlModePage;