import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import AirplayRoundedIcon from '@mui/icons-material/AirplayRounded';
import CastConnectedRoundedIcon from '@mui/icons-material/CastConnectedRounded';
import SideBar from "../components/SideBar"
import './css/ModeSelectPage.css'
import { useNavigate } from "react-router-dom";
import { usePeerConnection } from "../contexts/PeerConnectionContext";
import { establishCastConnection } from '../peerconnection/PeerConnectionService';


// Modes: Browse, Control, Cast
function ModeSelectPage() {
    const navigate = useNavigate();
    const context = usePeerConnection();
    const { setConnectionMode } = context;
    const switchMode = (mode: string) => {
        setConnectionMode(mode)
        navigate("/"+ mode);
    }

    const castMedia = async () => {
        try {
            await establishCastConnection(context);
            console.log(`Established peer connection for user ${context.userId} in Cast mode with peer ID ${context.peerId}`);
        } catch (error) {
            console.error('Failed to establish cast connection:', error);
        }
    }
    return (
        <div className="modeSelectPage-div">
            <SideBar />
            <div className="mode-select-content-div">
                <h1>SELECT MODE</h1>
                <div className="modes-div">
                    <FolderRoundedIcon sx={{ fontSize: 200, cursor: 'pointer' }} onClick={() => switchMode("browse")}/>
                    <AirplayRoundedIcon sx={{ fontSize: 200, cursor: 'pointer' }} onClick={() => switchMode("control")}/>
                    <CastConnectedRoundedIcon sx={{ fontSize: 200, cursor: 'pointer' }} onClick={() => castMedia()}/>
                </div>
            </div>
        </div>
    )
}

export default ModeSelectPage