import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Make sure to create a Header.css file for styling


const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/">
          <img src="./logo_black.png" alt="EcoSprout Logo" className="logo-image" />
        </Link>
      </div>
      <nav className="header-nav">
        <Link to="/singleplayer" className="nav-link">Single Player</Link>
        <Link to="/doubleplayer" className="nav-link">Double Player</Link>
      </nav>
    </header>
  );
};

export default Header;
