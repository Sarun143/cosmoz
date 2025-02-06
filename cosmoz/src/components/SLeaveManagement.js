import React, { useState } from 'react';
import SHeader from './SHeader';
import SSidebar from './SSidebar';

const SLeaveManagement = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitLeave = async () => {
    setMessage('');
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      
      // Add more detailed debugging
      console.log('Token from localStorage:', token ? token.substring(0, 20) + '...' : 'No token');
      console.log('Authorization header:', `Bearer ${token}`.substring(0, 30) + '...');

      if (!token) {
        setMessage('Please login first');
        return;
      }

      // Validate input before sending the request
      if (!startDate || !endDate || !reason) {
        setMessage('Please fill in all the fields.');
        return;
      }

      if (new Date(startDate) > new Date(endDate)) {
        setMessage('End date cannot be before start date.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/staff/requestleave', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          reason,
        }),
      });

      // Get response text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        // Try to parse as JSON
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        setMessage('Server returned invalid response');
        return;
      }

      if (!response.ok) {
        // Use the error message from the response if available
        setMessage(data.message || 'Failed to submit leave request');
        return;
      }

      console.log('Success response:', data);
      setMessage('Leave request submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting leave request:', error);
      // More specific error message
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setMessage('Could not connect to server. Please check your internet connection.');
      } else {
        setMessage('An error occurred while submitting the leave request: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-container">
    <SHeader />
    <SSidebar />
      <div className="leave-form">
        <h1>Staff Leave Management</h1>
        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Reason:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for leave"
          />
        </div>
        <button onClick={handleSubmitLeave} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Leave Request'}
        </button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default SLeaveManagement;
