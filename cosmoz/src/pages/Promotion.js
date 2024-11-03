import React, { useState, useEffect } from 'react';
import './Promotion.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';

const Promotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    details: '',
    startDate: '',
    endDate: '',
    discountRule: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const res = await axios.get('/api/promotions');
      setPromotions(res.data);
    } catch (err) {
      console.error('Error fetching promotions:', err);
    }
  };

  const validateDates = () => {
    const start = new Date(newPromotion.startDate);
    const end = new Date(newPromotion.endDate);
    const today = new Date();

    if (start < today) {
      setError('Start date cannot be in the past');
      return false;
    }
    if (end < start) {
      setError('End date cannot be before start date');
      return false;
    }
    setError('');
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromotion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPromotion = async (e) => {
    e.preventDefault();
    
    if (!validateDates()) {
      return;
    }

    try {
      const res = await axios.post('/api/promotions/add', {
        ...newPromotion,
        isActive: true
      });
      
      setPromotions([...promotions, res.data.promotion]);
      setNewPromotion({
        name: '',
        details: '',
        startDate: '',
        endDate: '',
        discountRule: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding promotion');
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
      <h2>Current Promotions</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleAddPromotion} className="promotion-form">
        <input
          type="text"
          name="name"
          placeholder="Promotion Name"
          value={newPromotion.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="details"
          placeholder="Promotion Details"
          value={newPromotion.details}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="startDate"
          value={newPromotion.startDate}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="endDate"
          value={newPromotion.endDate}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="discountRule"
          placeholder="Discount Rule (e.g., '10% OFF')"
          value={newPromotion.discountRule}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Promotion</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Details</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Discount Rule</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promotion) => (
            <tr key={promotion._id}>
              <td>{promotion.name}</td>
              <td>{promotion.details}</td>
              <td>{new Date(promotion.startDate).toLocaleDateString()}</td>
              <td>{new Date(promotion.endDate).toLocaleDateString()}</td>
              <td>{promotion.discountRule}</td>
              <td>{promotion.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <button
                  className={promotion.isActive ? 'on' : 'off'}
                  onClick={() => handleToggle(promotion._id)}
                >
                  {promotion.isActive ? 'Deactivate' : 'Activate'}
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
