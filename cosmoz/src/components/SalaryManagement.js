import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import './SalaryManagement.css';

const SalaryManagement = () => {
  const [staff, setStaff] = useState([]);
  const [salary, setSalary] = useState("");
  const [staffId, setStaffId] = useState("");
  
  useEffect(() => {
    axios.get('http://localhost:5000/api/staff') // Fetch staff data
      .then(response => {
        setStaff(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  const handleSalaryChange = (e) => {
    setSalary(e.target.value);
  };

  const handleStaffIdChange = (e) => {
    setStaffId(e.target.value);
  };

  const handleUpdateSalary = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/staff/${staffId}`, { salary })
      .then(response => {
        alert('Salary updated!');
        setSalary("");
        setStaffId("");
        // Optionally refresh staff list
      })
      .catch(error => console.log(error));
  };

  const handleDeleteSalary = (id) => {
    axios.delete(`http://localhost:5000/api/staff/${id}`)
      .then(response => {
        alert('Salary record deleted!');
        // Optionally refresh staff list
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="salary-management">
      <Header />
      <Sidebar />
      <h1>Salary Management</h1>
      <form onSubmit={handleUpdateSalary} className="salary-form">
        <label htmlFor="staffId">Staff ID</label>
        <input type="text" id="staffId" value={staffId} onChange={handleStaffIdChange} required />
        
        <label htmlFor="salary">Salary</label>
        <input type="number" id="salary" value={salary} onChange={handleSalaryChange} required />
        
        <button type="submit" className="update-btn">Update Salary</button>
      </form>

      <div className="salary-list">
        <h2>Staff Salary Records</h2>
        <table>
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(staffMember => (
              <tr key={staffMember._id}>
                <td>{staffMember.staffId}</td>
                <td>{staffMember.name}</td>
                <td>{staffMember.salary}</td>
                <td>
                  <button onClick={() => handleDeleteSalary(staffMember._id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryManagement;
