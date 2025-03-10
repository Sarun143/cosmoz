import React, { useEffect, useState } from 'react';
import './SAttendance.css';
import SHeader from './SHeader';
import SSidebar from './SSidebar';

const StaffAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch attendance data from backend
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/staff/attendance');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setAttendance(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setMessage('Failed to load attendance data');
      setIsLoading(false);
    }
  };

  const handleToggleAttendance = async (entryId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
      
      // Update optimistically in UI
      const updatedAttendance = attendance.map(entry => 
        entry.id === entryId ? { ...entry, status: newStatus } : entry
      );
      setAttendance(updatedAttendance);
      
      // Send update to server
      const response = await fetch(`/api/staff/attendance/${entryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      setMessage('Attendance updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating attendance:', error);
      setMessage('Failed to update attendance');
      // Revert the optimistic update
      fetchAttendance();
    }
  };

  const markTodayAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/staff/attendance/today', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: currentDate, status: 'Present' }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark attendance');
      }
      
      // Refresh the attendance list
      await fetchAttendance();
      setMessage('Today\'s attendance marked successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error marking attendance:', error);
      setMessage(error.message || 'Failed to mark today\'s attendance');
      setIsLoading(false);
    }
  };

  return (
    <div className="attendance-container">
      <SHeader/>
      <div className="content-wrapper">
        <SSidebar/>
        <div className="main-content">
          <div className="attendance-header">
            <h2>Staff Attendance</h2>
            <button 
              className="mark-attendance-btn"
              onClick={markTodayAttendance}
              disabled={isLoading}
            >
              Mark Today's Attendance
            </button>
          </div>
          
          {message && (
            <div className="message">{message}</div>
          )}
          
          {isLoading ? (
            <div className="loading">Loading attendance data...</div>
          ) : (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan="3">No attendance records found</td>
                  </tr>
                ) : (
                  attendance.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.date}</td>
                      <td className={entry.status === 'Present' ? 'present' : 'absent'}>
                        {entry.status}
                      </td>
                      <td>
                        <div className="toggle-container">
                          <div 
                            className={`toggle ${entry.status === 'Present' ? 'active' : ''}`}
                            onClick={() => handleToggleAttendance(entry.id, entry.status)}
                          >
                            <div className="toggle-button"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffAttendance;