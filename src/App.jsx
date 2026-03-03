import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Registration from './components/Registration';
import MapHub from './components/MapHub';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import About from './components/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans bg-parchment">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/map" element={<MapHub />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
