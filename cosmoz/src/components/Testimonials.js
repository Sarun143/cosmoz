import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  return (
    <section className="testimonials" id="testimonials">
      <h2>What Our Clients Say</h2>
      <div className="testimonial-list">
        <div className="testimonial-item">
          <p>"An unforgettable experience! Cozmos Travels made everything easy."</p>
          <h4>- Mathew John</h4>
        </div>
        <div className="testimonial-item">
          <p>"Great service and amazing travel packages. Highly recommend!"</p>
          <h4>- Sreya </h4>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
