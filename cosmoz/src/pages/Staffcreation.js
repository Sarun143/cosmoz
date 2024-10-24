import React, { useState, useEffect } from 'react';
import './Staffcreation.css';
import { useNavigate, useParams } from 'react-router-dom';

const StaffCreationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'driver',
    aadhaarNumber: '',
    aadhaarPhoto: null,
    drivingLicense: '',
    drivingLicensePhoto: null,
    // password: '', // Optional password from admin
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchStaff = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/staff/${id}`);
          if (!response.ok) throw new Error('Failed to fetch staff data');
          const data = await response.json();
          setFormData(data);
        } catch (error) {
          console.error('Error fetching staff data:', error);
          setErrorMessage('Failed to fetch staff data');
        }
      };
      fetchStaff();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const fileType = files[0].type;
      if (fileType === 'image/jpeg' || fileType === 'image/jpg') {
        setFormData({ ...formData, [name]: files[0] });
        setErrorMessage(''); // Clear any previous error messages
      } else {
        setErrorMessage('Please upload a JPEG or JPG file.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const method = id ? 'PUT' : 'POST';
      const url = id ? `http://localhost:5000/api/staff/${id}` : 'http://localhost:5000/api/create';
      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to save staff');
      }

      setSuccessMessage('Staff saved successfully!');
      navigate('/admin/staffmanagemenet');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="staff-creation-form">
      <h2>{id ? 'Update Staff' : 'Create Staff'}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="driver">Driver</option>
          <option value="conductor">Conductor</option>
        </select>

        <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} placeholder="Aadhaar Number" required />
        <input type="file" name="aadhaarPhoto" onChange={handleFileChange} accept=".jpeg,.jpg" required />
        <input type="text" name="drivingLicense" value={formData.drivingLicense} onChange={handleChange} placeholder="Driving License" required />
        <input type="file" name="drivingLicensePhoto" onChange={handleFileChange} accept=".jpeg,.jpg" required />

        {/* Optional Password */}
        {/* <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password (Optional)" /> */}

        <button type="submit">{id ? 'Update' : 'Create'} Staff</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
    </div>
  );
};

export default StaffCreationForm;
