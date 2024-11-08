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

  // Fetch promotions from the backend on component mount
  useEffect(() => {
    fetchPromotions();
  }, []);

  // Function to fetch all promotions
  const fetchPromotions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/promotions');
      setPromotions(res.data);
    } catch (err) {
      console.error('Error fetching promotions:', err);
    }
  };

  // Function to validate start and end dates
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

  // Function to handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromotion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to add a new promotion
  const handleAddPromotion = async (e) => {
    e.preventDefault();

    // Validate dates before submitting
    if (!validateDates()) {
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/promotions/add', {
        ...newPromotion,
        isActive: true,
      });
      
      // Add new promotion to the state and reset form
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

  // Function to toggle promotion's active status
  const handleToggle = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/promotions/toggle/${id}`);
      const updatedPromotions = promotions.map((promotion) =>
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
          id="promotion-name"
          value={newPromotion.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="details"
          placeholder="Promotion Details"
          id ="promotion-details"
          value={newPromotion.details}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="startDate"
          id ="promotion-start-date"
          value={newPromotion.startDate}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="endDate"
          id="promotion-end-date"
          value={newPromotion.endDate}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="discountRule"
          id="promotion-discount-rule"
          placeholder="Discount Rule (e.g., '10% OFF')"
          value={newPromotion.discountRule}
          onChange={handleInputChange}
          required
        />
        <button type="submit" id="submitt">Add Promotion</button>
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
