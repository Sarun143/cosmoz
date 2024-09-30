import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ContentArea from './Contentarea';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState('Dashboard'); // Manage which section is active

  return (
    <div className="dashboard">
      <Header />
      <Sidebar setSelectedSection={setSelectedSection} />
      <ContentArea selectedSection={selectedSection} />
    </div>
  );
};

export default AdminDashboard;
