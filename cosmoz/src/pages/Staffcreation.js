import React, { useState } from 'react';
import './Staffcreation.css';

const StaffCreationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    staffId: '',
    role: 'driver', // Default role
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Sending formData as JSON
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Staff created:', result);
        setSuccessMessage('Staff created successfully!');
        setErrorMessage('');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          staffId: '',
          role: 'driver',
        });
      } else {
        const errorData = await response.json();
        console.error('Error creating staff:', errorData);
        setErrorMessage('Failed to create staff: ' + errorData.error);
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Network error:', error);
      setErrorMessage('Network error. Please try again later.');
      setSuccessMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="staff-creation-form">
      <h2>Create Staff</h2>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="phone">Phone Number:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="staffId">Staff ID:</label>
        <input
          type="text"
          id="staffId"
          name="staffId"
          value={formData.staffId}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="role">Role:</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="driver">Driver</option>
          <option value="conductor">Conductor</option>
        </select>
      </div>

      <button type="submit">Create Staff</button>
    </form>
  );
};

export default StaffCreationForm;
