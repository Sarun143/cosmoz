import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logic for logout (e.g., clearing tokens, redirecting to login page)
    console.log('Logging out...');
    
    // Clear authentication data (if stored in local storage or context)
    localStorage.removeItem('authToken'); // Replace 'authToken' with your actual token key
    // Or if using a context, you might want to reset the context state

    // Redirect to login page
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">Admin Dashboard</div>
      <div className="admin-info">
        <span>Cosmoz</span>
        <img src="/assests/images/cosmozlogo.png.png" alt="" />
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
