import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import AirplayRoundedIcon from '@mui/icons-material/AirplayRounded';
import CastConnectedRoundedIcon from '@mui/icons-material/CastConnectedRounded';
import SideBar from "../components/SideBar"
import './css/ModeSelectPage.css'
import { useNavigate } from "react-router-dom";
import { getPeerConnection } from "../contexts/PeerConnectionContext";


// Modes: Browse, Control, Cast
function ModeSelectPage() {
    const navigate = useNavigate();
    const { setConnectionMode } = getPeerConnection();
    const switchMode = (mode: string) => {
        setConnectionMode(mode)
        navigate("/"+ mode);
    }
    return (
        <div className="modeSelectPage-div">
            <SideBar />
            <div className="mode-select-content-div">
                <h1>SELECT MODE</h1>
                <div className="modes-div">
                    <FolderRoundedIcon fontSize="large" sx={{ cursor: 'pointer' }} onClick={() => switchMode("browse")}/>
                    <AirplayRoundedIcon fontSize="large" sx={{ cursor: 'pointer' }} onClick={() => switchMode("control")}/>
                    <CastConnectedRoundedIcon fontSize="large" sx={{ cursor: 'pointer' }} onClick={() => switchMode("cast")}/>
                </div>
            </div>
        </div>
    )
}

export default ModeSelectPage