import React, { useState } from 'react';

const SLeaveManagement = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmitLeave = async () => {
    setMessage(''); // Reset message

    // Validate input before sending the request
    if (!startDate || !endDate || !reason) {
      setMessage('Please fill in all the fields.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setMessage('End date cannot be before start date.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/staff/requestleave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          reason,
        }),
      });

      // Log the response status for debugging
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        setMessage(`Error: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      console.log('Success response:', data);
      setMessage('Leave request submitted successfully!');
    } catch (error) {
      console.error('Error submitting leave request:', error);
      setMessage('An error occurred while submitting the leave request.');
    }
  };

  return (
    <div>
      <h1>Staff Leave Management</h1>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div>
        <label>Reason:</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for leave"
        />
      </div>
      <button onClick={handleSubmitLeave}>Submit Leave Request</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SLeaveManagement;
