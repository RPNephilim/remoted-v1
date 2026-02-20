import SideBar from "../components/SideBar"
import { getUser } from "../contexts/UserContext";
import './css/DevicePage.css'
import Button from '@mui/material/Button';
import type { DeviceType } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../peerconnection/PeerConnectionService";
import { useEffect, useState } from "react";
import { usePeerConnectionRef } from "../hooks/usePeerConnectionRef";

function DevicePage() {
  const { user } = getUser();
  const devices = user?.devices || [];
  const navigate = useNavigate();
  const [ connectWithAnotherDevice, setConnectWithAnotherDevice ] = useState(false);
  const {
    peerId, setUserId, setPeerId, getContext
  } = usePeerConnectionRef();

  const selectCurrentDevice = (device: DeviceType) => {
    setUserId(device["deviceName"]);
    console.log(`set userId to: ${getContext().userId}`)
    registerUser(getContext());
  }

  const selectPeerDevice = (device: DeviceType) => {
    if (device["deviceName"] === getContext().userId) {
      console.log("Cannot select the same device as peer, please select different device")
      return
    }
    setPeerId(device["deviceName"])
    console.log(`set peerId to: ${getContext().peerId}`)
  }

  const switchToModeSelect = () => {
    if (getContext().userId === getContext().peerId) {
      console.log("Please select different peer to connect")
      return
    }
    navigate('/mode-select')
  }

  useEffect(() => {
    if (getContext().remoteStream) {
      // console.log("Remote stream updated in DevicePage:", getContext().remoteStream);
      navigate('/cast');
    }
  }, [getContext().remoteStream]);
  
  return (
    <>
      {<div className="devicepage-div">
        <SideBar />
        <div className="devicepage-content-div">
          <h1>{devices.length > 0 ? "Select Your Device" : "No Device Added"}</h1>
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
                    <tr key={device["deviceName"]} id={device["deviceName"] === getContext().userId ? "device-tr-selected" : "device-tr"} onClick={() => selectCurrentDevice(device)}>
                      <td>{device["deviceName"]}</td>
                      <td>{device["lastUsed"]}</td>
                      <td>{device["dateAdded"]}</td>
                      <td>{device["active"] ? "Online" : "False"}</td>
                      <td>{device["connected"] ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          }
          {connectWithAnotherDevice && devices.length > 0 && <div className="select-peer-device-div">
            <h1>{devices.length > 1 ? "Select Peer Device" : "Add another device to Connect"}</h1>
            {devices.length > 1 && <div className="devicesList-div">
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
                    <tr key={device["deviceName"]} id={device["deviceName"] === peerId ? "device-tr-selected" : "device-tr"} onClick={() => selectPeerDevice(device)}>
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
          </div>}
          <div className="buttons-div">
            <Button variant="contained">ADD DEVICE</Button>
            {!connectWithAnotherDevice && <Button variant="contained" onClick={() => setConnectWithAnotherDevice(true)}>CONNECT WITH ANOTHER DEVICE</Button>}
            {connectWithAnotherDevice && <Button variant="contained" onClick={switchToModeSelect}>SELECT MODE</Button>}
          </div>

        </div>

      </div>}
    </>
  )
}

export default DevicePage