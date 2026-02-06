import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import DevicePage from './pages/DevicePage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/devices' element={<DevicePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
