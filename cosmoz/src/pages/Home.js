
import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/Herosection';
import Services from '../components/Services';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import TopDestinations from '../components/Topdestiantions';
import Gallery from '../components/Gallery';
import AmenitySlider from '../components/AmenitySlider';
import Promotioncomponet from '../components/Promotioncomponent';


//import Slidingtext from '../components/Slidingtext';


// import axios from 'axios';
// import Users from './Users';

function Home() {
  return (
    <div className="App">
      <Navbar />
      <HeroSection />
      <TopDestinations/>
      <Promotioncomponet/>
      <Services />
      <AmenitySlider/>

      <About />
    {/* <Slidingtext/> */}
      <Testimonials />
      <Gallery/>
      <Contact />
      <Footer />
     
    </div>
  );
}

export default Home;