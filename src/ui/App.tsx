import { HashRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { UserProvider } from './contexts/UserContext';
import { PeerConnectionProvider } from './contexts/PeerConnectionContext';
import AuthenticationPage from './pages/AuthenticationPage';
import SessionDeviceSelectPage from './pages/SessionDeviceSelectPage';
import DashboardPage from './pages/DashboardPage';

function App() {


  return (
    <UserProvider>
      <PeerConnectionProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<AuthenticationPage />} />
            <Route path='/device-select' element={<SessionDeviceSelectPage />} />
            <Route path='/dashboard' element={<DashboardPage />} />
          </Routes>
        </HashRouter>
      </PeerConnectionProvider>
    </UserProvider>
  )
}

export default App
