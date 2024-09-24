
import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/Herosection';
import Services from '../components/Services';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

// import axios from 'axios';
// import Users from './Users';

function Home() {
  return (
    <div className="App">
      <Navbar />
      <HeroSection />
      <Services />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
     
    </div>
  );
}

export default Home;