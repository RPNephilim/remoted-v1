import { getPeerConnection } from "../contexts/PeerConnectionContext"

function ModeSelectPage() {
    const { userId, peerId } = getPeerConnection();
    return (
        <div className="modeSelect-div">
            <h1>Mode Select Page</h1>
            <p>User ID: {userId}</p>
            <p>Peer ID: {peerId}</p>
        </div>
    )
}

export default ModeSelectPage