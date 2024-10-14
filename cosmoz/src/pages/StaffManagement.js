import React, { useState, useEffect } from 'react';
import './StaffManagement.css';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const StaffManagement = () => {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    staffId: '',
    role: '',
    onDuty: false,
  });
  const [errors, setErrors] = useState({});

  // Fetch staff data from backend
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/vstaff'); // Replace with your correct backend API
        const data = await response.json();
        setStaffList(data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };
    fetchStaff();
  }, []);

  const handleDelete = (id) => {
    const updatedList = staffList.filter((staff) => staff._id !== id);
    setStaffList(updatedList);
    // Optionally, send a DELETE request to the backend to remove staff from the database
  };

  const handleUpdate = (id) => {
    const staffToUpdate = staffList.find((staff) => staff._id === id);
    setNewStaff(staffToUpdate);
    setIsModalOpen(true);
  };

  const validateField = (name, value) => {
    let error = '';
    if (name === 'name' && !value) error = 'Name is required';
    if (name === 'email' && (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) error = 'Valid email is required';
    if (name === 'phone' && (!value || !/^\d{10}$/.test(value))) error = 'Valid 10-digit phone number is required';
    if (name === 'staffId' && !value) error = 'Staff ID is required';
    if (name === 'role' && !value) error = 'Role is required';
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({ ...newStaff, [name]: value });

    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const validationErrors = {};
    Object.keys(newStaff).forEach((field) => {
      const error = validateField(field, newStaff[field]);
      if (error) validationErrors[field] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      if (newStaff.id) {
        setStaffList(staffList.map((staff) => (staff.id === newStaff.id ? newStaff : staff)));
      } else {
        setStaffList([...staffList, { ...newStaff, id: staffList.length + 1, attendance: 'Present' }]);
      }
      setIsModalOpen(false);
    }
  };

  return (
    <div className="staff-management">
      <Sidebar />
      <h2>Manage Staff</h2>
      <button className="create-button" onClick={() => navigate('/Staffcreation')}>Create Staff</button>
      <table>
        <thead>
          <tr>
            <th>Staff Name</th>
            <th>Email</th>
            <th>Phone No</th>
            <th>Staff ID</th>
            <th>Role</th>
            <th>Attendance</th>
            <th>On Duty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff._id}>
              <td>{staff.name}</td>
              <td>{staff.email}</td>
              <td>{staff.phone}</td>
              <td>{staff.staffId}</td>
              <td>{staff.role}</td>
              <td>{staff.attendance}</td>
              <td>{staff.onDuty ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleUpdate(staff._id)}>Update</button>
                <button onClick={() => handleDelete(staff._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffManagement;
