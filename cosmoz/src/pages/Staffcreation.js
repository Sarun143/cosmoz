import React, { useState, useEffect } from 'react';
import './Staffcreation.css';
import { useNavigate, useParams } from 'react-router-dom';

const StaffCreationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the staff ID from the URL
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    staffId: '',
    role: 'driver', // Default role
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchStaff = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/staff/${id}`);
          const data = await response.json();
          setFormData(data);
        } catch (error) {
          console.error('Error fetching staff data:', error);
        }
      };
      fetchStaff();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = id ? 'PUT' : 'POST'; // Determine the method
      const url = id ? `http://localhost:5000/api/staff/${id}` : 'http://localhost:5000/api/create'; // Determine the URL
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage('Staff saved successfully!');
        navigate('/staffmanagement'); // Redirect to staff management
      } else {
        throw new Error('Failed to save staff');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="staff-creation-form">
      <h2>{id ? 'Update Staff' : 'Create Staff'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
        <input type="text" name="staffId" value={formData.staffId} onChange={handleChange} placeholder="Staff ID" required />
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="driver">Driver</option>
          <option value="conductor">Conductor</option>
        </select>
        <button type="submit">{id ? 'Update' : 'Create'} Staff</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
    </div>
  );
};

export default StaffCreationForm;
