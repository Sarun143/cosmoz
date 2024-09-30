import React, { useState } from 'react';
import './Promotion.css';

const Promotion = () => {
  const [promotionData, setPromotionData] = useState({
    name: '',
    details: '',
    startDate: '',
    endDate: '',
    discountRule: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPromotionData({
      ...promotionData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Promotion Created:', promotionData);
    // You can add the logic to send the promotion data to the backend
    setPromotionData({
      name: '',
      details: '',
      startDate: '',
      endDate: '',
      discountRule: ''
    });
  };

  return (
    <div className="promotion-container">
      <h2>Create a New Promotion</h2>
      <form className="promotion-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Promotion Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={promotionData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="details">Details</label>
          <textarea
            id="details"
            name="details"
            value={promotionData.details}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={promotionData.startDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={promotionData.endDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="discountRule">Discount Rule</label>
          <input
            type="text"
            id="discountRule"
            name="discountRule"
            value={promotionData.discountRule}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">Create Promotion</button>
      </form>
    </div>
  );
};

export default Promotion;
