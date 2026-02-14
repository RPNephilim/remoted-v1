import SideBar from "../components/SideBar"
import { getUser } from "../contexts/UserContext";
import './css/DevicePage.css'
import Button from '@mui/material/Button';
import type { DeviceType } from "../contexts/UserContext";
import { getPeerConnection } from "../contexts/PeerConnectionContext";
import { useNavigate } from "react-router-dom";

function DevicePage() {
  const { user } = getUser();
  const devices = user?.devices || [];
  const { setUserId } = getPeerConnection();
  const navigate = useNavigate();

  const connectWithDevice = (device: DeviceType) => {
    if (device["lastUsed"] === "Current Device") {
      console.info("Already connected with the device!!!");
      return;
    }
    if (!device["active"]) {
      console.error("Device is not active!!!");
      return;
    }
    console.log(`Connecting with device ${device["deviceName"]}`)
    setUserId(device["deviceName"]);
    navigate('/mode-select');
  }
  return (
    <>
      <div className="devicepage-div">
        <SideBar />
        <div className="devicepage-content-div">
          <h1>{devices.length > 0 ? "Select Device" : "No Device Added"}</h1>
          {devices.length === 0 && <input type="text" placeholder="Device Name" id="deviceName-input" />}
          {devices.length > 0 &&
            <div className="devicesList-div">
              <table id="devices-table">
                <tbody>
                  <tr>
                    <th>Device Name</th>
                    <th>Last Used</th>
                    <th>Date Added</th>
                    <th>Active</th>
                    <th>Connected</th>
                  </tr>
                  {devices.map((device: any) => (
                    <tr key={device["deviceName"]} id="device-tr" onClick={() => connectWithDevice(device)}>
                      <td>{device["deviceName"]}</td>
                      <td>{device["lastUsed"]}</td>
                      <td>{device["dateAdded"]}</td>
                      <td>{device["active"] ? "Online" : "False"}</td>
                      <td>{device["connected"] ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>}
          {devices.length === 0 && <Button variant="contained">ADD DEVICE</Button>}
        </div>

      </div>
    </>
  )
}

export default DevicePage