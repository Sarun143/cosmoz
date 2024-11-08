import React from 'react';
import './SSidebar.css';
import { useNavigate } from 'react-router-dom';

const SSidebar = ({ setSelectedSection }) => {
  const navigate = useNavigate();
  return (
    <aside className="ssidebar">
      <ul>
      <li onClick={() => navigate('/staff/profile')}>Profile</li>
      <li onClick={() => navigate('/staff/attendance')}>Attendance</li>
      <li onClick={() => navigate('/staff/leave-management')}>LeaveManagement</li>
    {/* <li onClick={() => navigate('/staff/salary')}>Salary</li> */}
      <li onClick={() => navigate('/staff/scheduledtrips')}>ScheduledTrips</li>
    </ul>
    </aside>
  );
};

export default SSidebar;
