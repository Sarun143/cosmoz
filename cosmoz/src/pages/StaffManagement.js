import React, { useState } from 'react';
import './StaffManagement.css';
import Sidebar from '../components/Sidebar';

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Shibu Thomas', email: 'shibu@example.com', phone: '1234567890', staffId: 'ST01', role: 'Driver', attendance: 'Present', onDuty: true },
    { id: 2, name: 'Sathyan V K', email: 'sathyan@example.com', phone: '0987654321', staffId: 'SVK02', role: 'Conductor', attendance: 'Absent', onDuty: false }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    staffId: '',
    role: '',
    onDuty: false
  });
  const [errors, setErrors] = useState({});

  const handleDelete = (id) => {
    const updatedList = staffList.filter(staff => staff.id !== id);
    setStaffList(updatedList);
  };

  const handleUpdate = (id) => {
    const staffToUpdate = staffList.find(staff => staff.id === id);
    setNewStaff(staffToUpdate);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setNewStaff({
      name: '',
      email: '',
      phone: '',
      staffId: '',
      role: ''
    });
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
    Object.keys(newStaff).forEach(field => {
      const error = validateField(field, newStaff[field]);
      if (error) validationErrors[field] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      if (newStaff.id) {
        setStaffList(staffList.map(staff => (staff.id === newStaff.id ? newStaff : staff)));
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
      <button className="create-button" onClick={handleCreate}>Create Staff</button>
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
          {staffList.map(staff => (
            <tr key={staff.id}>
              <td>{staff.name}</td>
              <td>{staff.email}</td>
              <td>{staff.phone}</td>
              <td>{staff.staffId}</td>
              <td>{staff.role}</td>
              <td>{staff.attendance}</td>
              <td>{staff.onDuty ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleUpdate(staff.id)}>Update</button>
                <button onClick={() => handleDelete(staff.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{newStaff.id ? 'Update Staff' : 'Create Staff'}</h3>
            <form onSubmit={handleSave}>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={newStaff.name}
                onChange={handleInputChange}
              />
              {errors.name && <span className="error">{errors.name}</span>}

              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={newStaff.email}
                onChange={handleInputChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}

              <label>Phone No:</label>
              <input
                type="text"
                name="phone"
                value={newStaff.phone}
                onChange={handleInputChange}
              />
              {errors.phone && <span className="error">{errors.phone}</span>}

              <label>Staff ID:</label>
              <input
                type="text"
                name="staffId"
                value={newStaff.staffId}
                onChange={handleInputChange}
              />
              {errors.staffId && <span className="error">{errors.staffId}</span>}

              <label>Role:</label>
              <select
                name="role"
                value={newStaff.role}
                onChange={handleInputChange}
              >
                <option value="">Select Role</option>
                <option value="Driver">Driver</option>
                <option value="Conductor">Conductor</option>
              </select>
              {errors.role && <span className="error">{errors.role}</span>}

              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
