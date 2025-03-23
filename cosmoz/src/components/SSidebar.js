import React from 'react';
import './SSidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';

const SSidebar = ({ setSelectedSection }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Helper function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <aside className="ssidebar">
      <div className="ssidebar-header">
        <div className="ssidebar-logo">
          <span className="logo-icon">🚌</span>
          <span className="logo-text">Staff Portal</span>
        </div>
      </div>
      
      <ul className="ssidebar-menu">
        <li 
          className={isActive('/staff/profile') ? 'active' : ''} 
          onClick={() => navigate('/staff/profile')}
        >
          <span className="menu-icon">👤</span>
          <span className="menu-text">Profile</span>
        </li>
        
      {/* <li 
        className={isActive('/staff/attendance') ? 'active' : ''} 
        onClick={() => navigate('/staff/attendance')}
      >
        <span className="menu-icon">📋</span>
        <span className="menu-text">Attendance</span>
      </li> */}
        
        <li 
          className={isActive('/staff/leave-management') ? 'active' : ''} 
          onClick={() => navigate('/staff/leave-management')}
        >
          <span className="menu-icon">📅</span>
          <span className="menu-text">Leave Management</span>
        </li>
        
        <li 
          className={isActive('/staff/scheduledtrips') ? 'active' : ''} 
          onClick={() => navigate('/staff/scheduledtrips')}
        >
          <span className="menu-icon">🗺️</span>
          <span className="menu-text">Scheduled Trips</span>
        </li>
      </ul>
    </aside>
  );
};

export default SSidebar;
