import React from 'react';
import './Contact.css'; 

const Contact = () => {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-header">
        <h2>Contact Us</h2>
      </div>

      <div className="contact-container">
        <div className="contact-left">
          <h3> <span> Get in Touch with us</span></h3>
          <p><i className="fas fa-map-marker-alt"></i> COSMOZ TRAVELS<br />
            Koothattukulam,<br />
            Kottayam, Kottayam,<br />
            Kerala -686510
          </p>
          <p><i className="fas fa-phone"></i> 7559910825, 04822-279798 </p>
          <p><i className="fas fa-envelope"></i>cosmoztravels@gmail.com</p>
        </div>

        <div className="contact-right">
          <h3><span> E-Payment related issues</span></h3>
          <p><i className="fas fa-phone"></i> 04822-279799</p>
          <p><i className="fas fa-envelope"></i> support@mybusbookings.com</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
