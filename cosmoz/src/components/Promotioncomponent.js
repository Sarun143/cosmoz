import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Promotioncomponent.css';

const PromotionComponent = () => {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const fetchActivePromotions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/promotions/promotions/active');
        setPromotions(res.data);
      } catch (error) {
        console.error('Error fetching active promotions:', error);
      }
    };

    fetchActivePromotions();
  }, []);

  return (
    <div className="promotioncomponent">
      <h1 className="promotion-title">Exciting Offers Just for You!</h1>
      <div className="marquee-container">
        {promotions.length > 0 ? (
          <div className="marquee">
            {promotions.map((promotion) => (
              <div key={promotion._id} className="promotion-card">
                <h3>{promotion.name}</h3>
                <p>{promotion.details}</p>
                <p><strong>Discount:</strong> {promotion.discountRule}</p>
                <p>
                  <strong>Valid From:</strong> {new Date(promotion.startDate).toLocaleDateString()} to{' '}
                  {new Date(promotion.endDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-promotions">No active promotions available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default PromotionComponent;
