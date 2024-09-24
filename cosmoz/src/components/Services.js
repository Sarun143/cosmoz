import React from 'react';
import './Services.css';

const Services = () => {
  return (
    <section className="services" id="services">
      <div className="services-header">
        <h2>Our Services</h2>
        <p>Making your travel dreams a reality</p>
        <p>Enjoy competitive prices without compromising on comfort or quality. Customize your journey with our user-friendly booking system.</p>
      </div>

      <div className="services-content">
        <div className="services-image">
          <img src="/assests/images/cos1rbg.png" alt="Cosmoz Travel Buses" />
        </div>

        <div className="service-list">
          <div className="service-item">
            <h3>Affordable Prices</h3>
            <p>We partner with the top bus & train carriers to bring you the best deals.</p>
          </div>
          <div className="service-item">
            <h3>Easy to find</h3>
            <p>We at Cosmoz Travels want to make Seat Reservations as easy as possible for you.</p>
          </div>
          <div className="service-item">
            <h3>Easy Book</h3>
            <p>Without any extra fees, we make it easy to book your tickets.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
