import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Admin Dashboard</div>
      <div className="admin-info">
        <span>Admin Name</span>
{/* <img src="assets/images/cosmozlogo.png.png" alt="Admin Profile" /> */}
      </div>
    </header>
  );
};

export default Header;
