import React from 'react';
import './Navbar.css';
import Loginbtn from './loginbtn';


// import logo from '../assests/images/cosmozlog.png.png'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src= "/assests/images/cosmozlogo.png.png" alt="Cozmos Logo" className="logo-image" />
      
      </div>
      <ul className="navbar-menu">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#testimonials">Testimonials</a></li>
        <li><a href="#contact">Contact</a></li>
        <Loginbtn />
      </ul>
    </nav>
  );
};

export default Navbar;
