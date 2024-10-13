import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
// import ContentArea from './Contentarea';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState('Dashboard'); // Manage which section is active
  const  navigation=useNavigate()
  return (
    <div className="dashboard">
      <Header />
      <Sidebar setSelectedSection={setSelectedSection} />
    {/* <ContentArea selectedSection={selectedSection} /> */}
    </div>
  );
};

export default AdminDashboard;
