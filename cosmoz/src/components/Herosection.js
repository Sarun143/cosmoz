import React from 'react';
import './Herosection.css';
import SearchBar from '../pages/SearchBar';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Cosmoz Travels</h1>
        <p>Your journey begins here. Explore new places with us!</p>
        <button className="cta-button">Explore Now</button>
        <SearchBar/>
      </div>
    </section>
  );
};

export default HeroSection;
