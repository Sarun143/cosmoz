import React, { useState, useEffect } from 'react';
import './Promotion.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';

const Promotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [newOffer, setNewOffer] = useState('');
  const [newDetails, setNewDetails] = useState('');

  useEffect(() => {
    // Fetch promotions from the database
    const fetchPromotions = async () => {
      try {
        const res = await axios.get('/api/promotions');
        setPromotions(res.data);
      } catch (err) {
        console.error('Error fetching promotions:', err);
      }
    };

    fetchPromotions();
  }, []);

  const handleAddPromotion = async (e) => {
    e.preventDefault();

    const newPromotion = {
      offer: newOffer,
      details: newDetails,
      isActive: true, // Default to active when added
    };

    try {
      await axios.post('/api/promotions/add', newPromotion);
      setPromotions([...promotions, newPromotion]);
      setNewOffer('');
      setNewDetails('');
    } catch (err) {
      console.error('Error adding promotion:', err);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await axios.put(`/api/promotions/toggle/${id}`);
      const updatedPromotions = promotions.map(promotion =>
        promotion._id === id ? { ...promotion, isActive: res.data.promotion.isActive } : promotion
      );
      setPromotions(updatedPromotions);
    } catch (err) {
      console.error('Error toggling promotion status:', err);
    }
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
        <button type="submit">Add Promotion</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Offer</th>
            <th>Details</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promotion) => (
            <tr key={promotion._id}>
              <td>{promotion.offer}</td>
              <td>{promotion.details}</td>
              <td>{promotion.isActive ? 'On' : 'Off'}</td>
              <td>
                <button
                  className={promotion.isActive ? 'on' : 'off'}
                  onClick={() => handleToggle(promotion._id)}
                >
                  {promotion.isActive ? 'Turn Off' : 'Turn On'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Promotion;
