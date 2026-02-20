import SideBar from "../components/SideBar"
import { getUser } from "../contexts/UserContext";
import './css/DevicePage.css'
import Button from '@mui/material/Button';
import type { DeviceType } from "../contexts/UserContext";
import { usePeerConnection } from "../contexts/PeerConnectionContext";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../peerconnection/PeerConnectionService";
import { useState } from "react";

function DevicePage() {
  const { user } = getUser();
  const devices = user?.devices || [];
  const navigate = useNavigate();
  const [ connectWithAnotherDevice, setConnectWithAnotherDevice ] = useState(false);
  const {
    userId, peerId, connectionMode, serverConnection, peerConnection, localStream, remoteStream, dataChannel,
    setUserId, setPeerId, setConnectionMode, setServerConnection, setPeerConnection, setLocalStream, setRemoteStream, setDataChannel
  } = usePeerConnection();

  const selectCurrentDevice = (device: DeviceType) => {
    setUserId(device["deviceName"]);
    console.log(`set userId to: ${device["deviceName"]}`)
    registerUser({
      userId, peerId, connectionMode, serverConnection, peerConnection, localStream, remoteStream, dataChannel,
      setUserId, setPeerId, setConnectionMode, setServerConnection, setPeerConnection, setLocalStream, setRemoteStream, setDataChannel
    });
  }

  const selectPeerDevice = (device: DeviceType) => {
    if (device["deviceName"] === userId) {
      console.log("Cannot select the same device as peer, please select different device")
      return
    }
    setPeerId(device["deviceName"])
    console.log(`set peerId to: ${device["deviceName"]}`)
  }

  const switchToModeSelect = () => {
    if (userId === peerId) {
      console.log("Please select different peer to connect")
      return
    }
    navigate('/mode-select')
  }
  return (
    <>
      <div className="devicepage-div">
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
                    <tr key={device["deviceName"]} id={device["deviceName"] === userId ? "device-tr-selected" : "device-tr"} onClick={() => selectCurrentDevice(device)}>
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

      </div>
    </>
  )
}

export default DevicePage