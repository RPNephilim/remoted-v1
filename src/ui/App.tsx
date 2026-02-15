import { HashRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import DevicePage from './pages/DevicePage'
import { UserProvider } from './contexts/UserContext';
import { PeerConnectionProvider } from './contexts/PeerConnectionContext';
import ModeSelectPage from './pages/ModeSelectPage';
import BrowseModePage from './pages/BrowseModePage';
import ControlModePage from './pages/ControlModePage';
import CastModePage from './pages/CastModePage';

function App() {


  return (
    <UserProvider>
      <PeerConnectionProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path='/devices' element={<DevicePage />} />
            <Route path='/mode-select' element={<ModeSelectPage />} />
            <Route path='/browse' element={<BrowseModePage/>}/>
            <Route path='/control' element={<ControlModePage/>} />
            <Route path='/cast' element={<CastModePage/>} />
          </Routes>
        </HashRouter>
      </PeerConnectionProvider>
    </UserProvider>
  )
}

export default App
