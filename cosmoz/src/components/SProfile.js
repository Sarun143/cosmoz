import React, { useState, useEffect } from 'react';
import SHeader from './SHeader';
import SSidebar from './SSidebar';
import './SProfile.css';
import { useParams } from 'react-router-dom';

const StaffProfile = () => {
  const { id } = useParams(); // Get the staff ID from the route params
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    aadhaarNumber: '',
    drivingLicense: '',
    aadhaarPhoto: '',
    drivingLicensePhoto: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/staff/${id}`);
      if (!response.ok) throw new Error('Failed to fetch profile data');
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrorMessage('Error fetching profile data');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Error updating profile');
    }
  };

  return (
    <div>
      <SHeader />
      <SSidebar />
      <div className="staff-profile">
        <h2>Staff Profile</h2>
        <form onSubmit={handleUpdate}>
          <label>Name:</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />

          <label>Email:</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />

          <label>Phone:</label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />

          <label>Role:</label>
          <input
            type="text"
            value={profile.role}
            disabled
          />

          <label>Aadhaar Number:</label>
          <input
            type="text"
            value={profile.aadhaarNumber}
            disabled
          />

          <label>Driving License:</label>
          <input
            type="text"
            value={profile.drivingLicense}
            disabled
          />

          <label>Aadhaar Photo:</label>
          <img src={profile.aadhaarPhoto} alt="Aadhaar" width="100" />

          <label>Driving License Photo:</label>
          <img src={profile.drivingLicensePhoto} alt="License" width="100" />

          <button type="submit">Update Profile</button>
        </form>
        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
      </div>
    </div>
  );
};

export default StaffProfile;
