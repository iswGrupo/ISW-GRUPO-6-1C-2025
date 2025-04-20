import React from 'react';
import logo from '../imgs/LOGO.png'

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand flex items-center gap-2">
        <img
          src={logo}
          alt="Logo EcoHarmony"
          className="w-10 h-10 object-contain"
        />
        <h1>EcoHarmony Park</h1>
      </div>
      <ul className="navbar-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
      </ul>
    </nav>
  );
};

export default NavBar;
