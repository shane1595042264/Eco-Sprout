import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SinglePlayer from './SinglePlayer';
import DoublePlayer from './DoublePlayer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/singleplayer" element={<SinglePlayer />} />
        <Route path="/doubleplayer" element={<DoublePlayer />} />
      </Routes>
    </Router>
  );
}

export default App;
