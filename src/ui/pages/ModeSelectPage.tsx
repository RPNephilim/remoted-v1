import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import AirplayRoundedIcon from '@mui/icons-material/AirplayRounded';
import CastConnectedRoundedIcon from '@mui/icons-material/CastConnectedRounded';
import SideBar from "../components/SideBar"
import './css/ModeSelectPage.css'
import { useNavigate } from "react-router-dom";
import { usePeerConnectionRef } from "../hooks/usePeerConnectionRef";
import { establishCastConnection } from '../peerconnection/PeerConnectionService';


// Modes: Browse, Control, Cast
function ModeSelectPage() {
    const navigate = useNavigate();
    const { setConnectionMode, getContext } = usePeerConnectionRef();
    const switchMode = (mode: string) => {
        setConnectionMode(mode)
        navigate("/"+ mode);
    }

    const castMedia = async () => {
        try {
            setConnectionMode('cast');
            // Get current context and override connectionMode to ensure it's 'cast'
            const currentContext = { ...getContext(), connectionMode: 'cast' };
            
            // Check if browser supports getDisplayMedia
            if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
                alert('Screen sharing is not supported in your browser');
                return;
            }
            
            // Set role to caster since this user is initiating
            const { setCastRole } = getContext();
            setCastRole('caster');
            
            await establishCastConnection(currentContext);
            console.log(`Established peer connection in Cast mode`);
            navigate("/cast");
        } catch (error: any) {
            console.error('Failed to establish cast connection:', error);
            if (error.name === 'NotAllowedError') {
                alert('Screen sharing permission was denied. Please grant permission when prompted.');
            } else {
                alert(`Failed to start screen sharing: ${error.message}`);
            }
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