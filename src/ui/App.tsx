import { HashRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import DevicePage from './pages/DevicePage'
import { UserProvider } from './contexts/UserContext';
import { PeerConnectionProvider } from './contexts/PeerConnectionContext';
import ModeSelectPage from './pages/ModeSelectPage';

function App() {


  return (
    <UserProvider>
      <PeerConnectionProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path='/devices' element={<DevicePage />} />
            <Route path='/mode-select' element={<ModeSelectPage />} />
          </Routes>
        </HashRouter>
      </PeerConnectionProvider>
    </UserProvider>
  )
}

export default App
