import SideBar from "../components/SideBar"
import { getUser } from "../contexts/UserContext";
import './css/DevicePage.css'
import Button from '@mui/material/Button';

function DevicePage() {
  const { user } = getUser();
  const devices = user?.devices;

  const connectWithDevice = (device: string) => {
    console.log("Connecting with device", {device})
  }
  return (
    <>
      <div className="devicepage-div">
        <SideBar />
        <div className="devicepage-content-div">
          <h1>{devices?.length ? "Choose Device": "No Device Added"}</h1>
          <div className="devicesList-div">
            <table id="devices-table">
              <tbody>
                <tr>
                  <th>Device Name</th>
                  <th>Platform</th>
                  <th>Last Used</th>
                  <th>Date Added</th>
                  <th>Active</th>
                </tr>
                {devices?.map((device: any) => (
                  <tr key={device["deviceName"]} id="device-tr" onClick={() => connectWithDevice(device)}>
                    <td>{device["deviceName"]}</td>
                    <td>{device["platform"]}</td>
                    <td>{device["lastUsed"]}</td>
                    <td>{device["dateAdded"]}</td>
                    <td>{ device["active"]? "Online" : "False" }</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
          <Button variant="contained">Add New Device</Button>
        </div>

      </div>
    </>
  )
}

export default DevicePage