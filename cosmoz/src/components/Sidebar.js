import React from 'react';
import './Sidebar.css';

const Sidebar = ({ setSelectedSection }) => {
  return (
    <aside className="sidebar">
      <ul>
        <li onClick={() => setSelectedSection('Dashboard')}>Dashboard</li>
        <li onClick={() => setSelectedSection('ManageRoutes')}>Manage Routes</li>
        <li onClick={() => setSelectedSection('ManageStaff')}>Manage Staff</li>
        <li onClick={() => setSelectedSection('ViewFeedback')}>View Feedback</li>
        <li onClick={() => setSelectedSection('Attendance')}>Attendance</li>
        <li onClick={() => setSelectedSection('LeaveRequests')}>Leave Requests</li>
        <li onClick={() => setSelectedSection('Promotion')}>Promotion</li>



      </ul>
    </aside>
  );
};

export default Sidebar;
