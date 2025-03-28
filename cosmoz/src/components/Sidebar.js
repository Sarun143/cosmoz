import React from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

        
const Sidebar = ({ setSelectedSection }) => {
  const navigate = useNavigate();
  return (
    <aside className="sidebar">
      <ul>
        <li onClick={() => navigate('/AdminHome')}>Dashboard</li>
        <li onClick={() => navigate('/admin/routemanagement')}>Manage Routes</li>
        <li onClick={() => navigate('/admin/staffmanagemenet')}>Manage Staff</li>
        <li onClick={() => navigate('/admin/viewfeedback')}>View Feedback</li>
      {/* <li onClick={() => navigate('/admin/attendance')}>Attendance</li> */}
        <li onClick={() => navigate('/admin/leaverequests')}>Leave Requests</li>
        <li id="promotionn" onClick={() => navigate('/admin/promotion')}>Promotion</li>
        <li onClick={() => navigate('/admin/busdetails')}>BusDetails</li>
      {/* <li onClick={() => navigate('/admin/salarymanagement')}>Salarymanagement</li> */}
        <li onClick={() => navigate('/admin/Booking')}>Booking</li>
        <li onClick={() => navigate('/NotificationsPage')}>Notification</li>







      </ul>
    </aside>
  );
};

export default Sidebar;
