import React, { useState, useEffect } from 'react';
import './StaffManagement.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
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
        const response = await fetch('http://localhost:5000/api/vstaff/view');
        const data = await response.json();
        setStaffList(data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };
    fetchStaff();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff?')) {
      try {
        await fetch(`http://localhost:5000/api/staff/${id}`, {
          method: 'DELETE',
        });
        const updatedList = staffList.filter((staff) => staff._id !== id);
        setStaffList(updatedList);
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
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

  const handleSave = async (e) => {
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
      try {
        if (newStaff._id) { // Update existing staff
          await fetch(`http://localhost:5000/api/staff/${newStaff._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newStaff),
          });
          setStaffList(staffList.map((staff) => (staff._id === newStaff._id ? newStaff : staff)));
        } else { // Create new staff
          const response = await fetch('http://localhost:5000/api/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newStaff),
          });
          const result = await response.json();
          setStaffList([...staffList, result]);
        }
      } catch (error) {
        console.error('Error saving staff:', error);
      }
      setIsModalOpen(false);
      setNewStaff({
        name: '',
        email: '',
        phone: '',
        staffId: '',
        role: '',
        onDuty: false,
      });
    }
  };

  return (
    <div className="staff-management">
      <Header />
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
      {isModalOpen && (
        <div className="modal">
          <h2>{newStaff._id ? 'Update Staff' : 'Create Staff'}</h2>
          <form onSubmit={handleSave}>
            <input name="name" value={newStaff.name} onChange={handleInputChange} placeholder="Name" required />
            {errors.name && <p className="error">{errors.name}</p>}
            <input name="email" value={newStaff.email} onChange={handleInputChange} placeholder="Email" required />
            {errors.email && <p className="error">{errors.email}</p>}
            <input name="phone" value={newStaff.phone} onChange={handleInputChange} placeholder="Phone" required />
            {errors.phone && <p className="error">{errors.phone}</p>}
            <input name="staffId" value={newStaff.staffId} onChange={handleInputChange} placeholder="Staff ID" required />
            {errors.staffId && <p className="error">{errors.staffId}</p>}
            <select name="role" value={newStaff.role} onChange={handleInputChange} required>
              <option value="">Select Role</option>
              <option value="driver">Driver</option>
              <option value="conductor">Conductor</option>
            </select>
            {errors.role && <p className="error">{errors.role}</p>}
            <button type="submit">{newStaff._id ? 'Update' : 'Create'} Staff</button>
            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
