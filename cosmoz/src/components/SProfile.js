import React, { useState, useEffect } from 'react';
import './SProfile.css';

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', role: '', password: '' });
  
  useEffect(() => {
    // Fetch the staff profile from the backend API
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    // API call to fetch profile
    const response = await fetch('/api/staff/profile');
    const data = await response.json();
    setProfile(data);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // API call to update the profile
    await fetch('/api/staff/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    alert('Profile updated successfully!');
  };

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleUpdate}>
        <label>Name:</label>
        <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        
        <label>Email:</label>
        <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
        
        <label>Phone:</label>
        <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
        
        <label>Password:</label>
        <input type="password" value={profile.password} onChange={(e) => setProfile({ ...profile, password: e.target.value })} />
        
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
