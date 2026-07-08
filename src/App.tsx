import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landing/LandingPage'
import GamePage from './pages/game/GamePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/play" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
