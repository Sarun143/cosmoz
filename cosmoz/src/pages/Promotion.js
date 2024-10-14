import React, { useState } from 'react';
import './Promotion.css';
import Sidebar from '../components/Sidebar'; // Sidebar component is used here
import Header from '../components/Header';

const Promotion = () => {
  const [promotions, setPromotions] = useState([
    { id: 1, offer: '20% off on tickets', details: 'Applicable on payment via Paytm' },
    { id: 2, offer: 'Buy 1 Get 1 Free', details: 'For trips booked on weekends' }
  ]);

  const [newOffer, setNewOffer] = useState('');
  const [newDetails, setNewDetails] = useState('');

  const handleAddPromotion = (e) => {
    e.preventDefault();
    
    // Create a new promotion object
    const newPromotion = {
      id: promotions.length + 1, // Simple ID generation
      offer: newOffer,
      details: newDetails
    };

    // Update the promotions state
    setPromotions([...promotions, newPromotion]);

    // Clear the input fields
    setNewOffer('');
    setNewDetails('');
  };

  return (
    <div className="promotion">
      <Sidebar />
      <Header />
      <h2>Current Offers</h2>

      {/* Form to add new promotion */}
      <form onSubmit={handleAddPromotion} className="promotion-form">
        <input
          type="text"
          placeholder="Offer"
          value={newOffer}
          onChange={(e) => setNewOffer(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Details"
          value={newDetails}
          onChange={(e) => setNewDetails(e.target.value)}
          required
        />
        <button type="submit">AddPromotion</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Offer</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promotion) => (
            <tr key={promotion.id}>
              <td>{promotion.offer}</td>
              <td>{promotion.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Promotion;
