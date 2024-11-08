import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Promotioncomponent.css';

const Promotioncomponet = () => {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const fetchActivePromotions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/promotions/active');
        setPromotions(res.data);
      } catch (error) {
        console.error('Error fetching active promotions:', error);
      }
    };

    fetchActivePromotions();
  }, []);

  return (
    <div className="promotioncomponent">
      <section className="promotions-section">
        {promotions.length > 0 ? (
          <div className="promotions-list">
            {promotions.map((promotion) => (
              <div key={promotion._id} className="promotion-card">
                <h3>{promotion.name}</h3>
                <p>{promotion.details}</p>
                <p>Discount: {promotion.discountRule}</p>
                <p>Valid From: {new Date(promotion.startDate).toLocaleDateString()} to {new Date(promotion.endDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No active promotions available at the moment.</p>
        )}
      </section>
    </div>
  );
};

export default Promotioncomponet;
