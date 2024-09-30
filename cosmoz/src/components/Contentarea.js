import React from 'react';
import './ContentArea.css';

const ContentArea = ({ selectedSection }) => {
  return (
    <main className="main-content">
      {selectedSection === 'Dashboard' && <Dashboard />}
      {selectedSection === 'ManageRoutes' && <ManageRoutes />}
      {selectedSection === 'ManageStaff' && <ManageStaff />}
      {selectedSection === 'ViewFeedback' && <ViewFeedback />}
      {selectedSection === 'Attendance' && <Attendance />}
      {selectedSection === 'LeaveRequests' && <LeaveRequests />}
    </main>
  );
};

// Example placeholders for each section
const Dashboard = () => <div>Dashboard Section</div>;
const ManageRoutes = () => <div>Manage Routes Section</div>;
const ManageStaff = () => <div>Manage Staff Section</div>;
const ViewFeedback = () => <div>View Feedback Section</div>;
const Attendance = () => <div>Attendance Section</div>;
const LeaveRequests = () => <div>Leave Requests Section</div>;

export default ContentArea;
