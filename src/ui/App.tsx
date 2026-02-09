import { HashRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import DevicePage from './pages/DevicePage'
import { UserProvider } from './contexts/UserContext';

function App() {


  return (
    <UserProvider>
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/devices' element={<DevicePage />} />
      </Routes>
    </HashRouter>
    </UserProvider>
  )
}

export default App
