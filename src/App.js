import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SinglePlayer from './SinglePlayer';
import DoublePlayer from './DoublePlayer';
import Header from './components/Header';
import Tutorial from './Tutorial';
function App() {
  return (
    <Router>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/singleplayer" element={<SinglePlayer />} />
        <Route path="/doubleplayer" element={<DoublePlayer />} />
        <Route path="/tutorial" element={<Tutorial />} />
      </Routes>
    </Router>
  );
}

export default App;
