import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import './css/SideBar.css'

function SideBar() {
    return(
        <>
            <div className="sidebar-div">
                <SettingsIcon fontSize="medium" sx={{ cursor: 'pointer' }}/>
                <AccountCircleIcon fontSize="medium" sx={{ cursor: 'pointer' }}/>
            </div>
        </>
    )
}

export default SideBar;