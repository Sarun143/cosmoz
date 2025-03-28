import React from 'react';
import './Herosection.css';
import SearchBar from '../pages/SearchBar';
import Chatbot from './Chatbot';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Cosmoz Travelmate.</h1>
        <p>Your journey begins here. Explore new places with us!</p>
        <button className="cta-button">Explore Now</button>
        <Chatbot/>
        <SearchBar/>
      </div>
    </section>
  );
};

export default HeroSection;



