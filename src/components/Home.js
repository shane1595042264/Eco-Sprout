import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Make sure to create this CSS file for styling

function Home() {
  const navigate = useNavigate();

  const handleNavigateSinglePlayer = () => {
    navigate('/singleplayer');
  };

  const handleNavigateDoublePlayer = () => {
    navigate('/doubleplayer');
  };

  return (
    <div className="home-container">
      <video autoPlay loop muted className="video-background">
        <source src="./background.mp4" type="video/mp4" />
      </video>

      <div className="content">
        <h1>Welcome to EcoSprout!</h1>
        <button onClick={handleNavigateSinglePlayer}>Single Player</button>
        <button onClick={handleNavigateDoublePlayer}>Double Player</button>
      </div>
    </div>
  );
}

export default Home;
