import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BusDetails.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const BusDetails = () => {
  const [buses, setBuses] = useState([]);
  const [newBus, setNewBus] = useState({
    busId: '',
    routeId: '',
    regNo: '',
    seatCapacity: '',
    status: 'Ready for Service',
    pollutionStartDate: '',
    pollutionEndDate: '',
    taxStartDate: '',
    taxEndDate: '', 
    permitStartDate: '',
    permitEndDate: '',
    photos: [] // Array to store uploaded images
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentBusId, setCurrentBusId] = useState(null);
  const [photo, setPhoto] = useState(null); // State to hold the uploaded photo
  const [errors, setErrors] = useState({}); // State to hold validation errors

  const generateNextBusId = () => {
    if (buses.length === 0) return 'BUS001';
    
    const lastBus = buses.reduce((max, bus) => {
      const busNumber = parseInt(bus.busId.replace('BUS', ''));
      return busNumber > max ? busNumber : max;
    }, 0);
    
    return `BUS${String(lastBus + 1).padStart(3, '0')}`;
  };

  useEffect(() => {
    const fetchBuses = async () => {
      const response = await axios.get('http://localhost:5000/api/buses');
      setBuses(response.data);
      setNewBus(prev => ({ ...prev, busId: generateNextBusId() }));
    };
    fetchBuses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBus({ ...newBus, [name]: value });

    // Dynamic validation
    if (['pollutionStartDate', 'pollutionEndDate', 'taxStartDate', 'taxEndDate', 'permitStartDate', 'permitEndDate'].includes(name)) {
      validateDateRange(name, value);
    }
  };

  const validateDateRange = (name, value) => {
    const dateFieldPrefix = name.split('StartDate')[0];
    const endDateField = `${dateFieldPrefix}EndDate`;
    const startDateField = `${dateFieldPrefix}StartDate`;
    
    let hasError = false;
    const newErrors = { ...errors };

    // Check if end date is before start date
    if (name.includes('EndDate')) {
      if (newBus[startDateField] && new Date(value) < new Date(newBus[startDateField])) {
        newErrors[name] = `${dateFieldPrefix.charAt(0).toUpperCase() + dateFieldPrefix.slice(1)} end date cannot be before start date`;
        hasError = true;
      }
    } else {
      if (newBus[endDateField] && new Date(value) > new Date(newBus[endDateField])) {
        newErrors[name] = `${dateFieldPrefix.charAt(0).toUpperCase() + dateFieldPrefix.slice(1)} start date cannot be after end date`;
        hasError = true;
      }
    }

    // Validate that dates are not in the past
    if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
      newErrors[name] = `${dateFieldPrefix.charAt(0).toUpperCase() + dateFieldPrefix.slice(1)} date cannot be in the past`;
      hasError = true;
    }

    if (!hasError) {
      delete newErrors[name];
    }
    
    setErrors(newErrors);
    return !hasError;
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleAddBus = async (e) => {
    e.preventDefault();

    // Validate all dates before submission
    const dateFields = [
      'pollutionStartDate', 'pollutionEndDate',
      'taxStartDate', 'taxEndDate',
      'permitStartDate', 'permitEndDate'
    ];

    const isValid = dateFields.every(field => validateDateRange(field, newBus[field]));

    if (!isValid) {
      alert('Please correct the date errors before submitting');
      return;
    }

    const formData = new FormData();
    formData.append('busId', newBus.busId);
    formData.append('routeId', newBus.routeId);
    formData.append('regNo', newBus.regNo);
    formData.append('seatCapacity', newBus.seatCapacity);
    formData.append('status', newBus.status);
    formData.append('pollutionStartDate', newBus.pollutionStartDate);
    formData.append('pollutionEndDate', newBus.pollutionEndDate);
    formData.append('taxStartDate', newBus.taxStartDate);
    formData.append('taxEndDate', newBus.taxEndDate);
    formData.append('permitStartDate', newBus.permitStartDate);
    formData.append('permitEndDate', newBus.permitEndDate);

    if (photo) {
      formData.append('photos', photo);
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/buses/${currentBusId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setBuses(buses.map(bus => (bus._id === currentBusId ? { ...bus, ...newBus } : bus)));
        setIsEditing(false);
        setCurrentBusId(null);
      } else {
        const response = await axios.post('http://localhost:5000/api/buses', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        setBuses([...buses, response.data]);
      }

      // Reset form
      setNewBus({
        busId: '',
        routeId: '',
        regNo: '',
        seatCapacity: '',
        status: 'Ready for Service',
        pollutionStartDate: '',
        pollutionEndDate: '',
        taxStartDate: '',
        taxEndDate: '',
        permitStartDate: '',
        permitEndDate: '',
        photos: []
      });
      setPhoto(null);
      setErrors({});

      // After successful submission, generate next bus ID for the form
      setNewBus(prev => ({
        ...prev,
        busId: generateNextBusId()
      }));

    } catch (error) {
      console.error('Error adding/updating bus:', error);
      alert('Failed to add/update the bus. Check the console for details.');
    }
  };

  const handleDeleteBus = async (id) => {
    await axios.delete(`http://localhost:5000/api/buses/${id}`);
    setBuses(buses.filter(bus => bus._id !== id));
  };

  const handleEditBus = (bus) => {
    setNewBus(bus);
    setIsEditing(true);
    setCurrentBusId(bus._id);
  };

  return (
    <div className="bus-details-container">
      <Sidebar />
      <Header/>
      <h1>Bus Details</h1>

      {/* Form to add or update bus */}
      <form className="add-bus-form" onSubmit={handleAddBus}>
        <input
          type="text"
          name="busId"
          placeholder="Bus ID"
          value={newBus.busId}
          readOnly
          style={{ backgroundColor: '#f0f0f0' }}
        />
        <input
          type="text"
          name="routeId"
          placeholder="Route ID"
          value={newBus.routeId}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="regNo"
          placeholder="Registration No"
          value={newBus.regNo}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="seatCapacity"
          min ="1"
          max="54"
          placeholder="Seat Capacity"
          value={newBus.seatCapacity}
          onChange={handleInputChange}
          required
        />
        <select name="status" value={newBus.status} onChange={handleInputChange} required>
          <option value="Ready for Service">Ready for Service</option>
          <option value="On Maintenance">On Maintenance</option>
        </select>

        {/* Pollution Details */}
        <h4>Pollution Details:</h4>
        <input
          type="date"
          name="pollutionStartDate"
          placeholder="Pollution Start Date"
          value={newBus.pollutionStartDate}
          onChange={handleInputChange}
          required
        />
        {errors.pollutionStartDate && <p className="error">{errors.pollutionStartDate}</p>}
        <input
          type="date"
          name="pollutionEndDate"
          placeholder="Pollution End Date"
          value={newBus.pollutionEndDate}
          onChange={handleInputChange}
          required
        />
        {errors.pollutionEndDate && <p className="error">{errors.pollutionEndDate}</p>}

        {/* Tax Details */}
        <h4>Tax Details:</h4>
        <input
          type="date"
          name="taxStartDate"
          placeholder="Tax Start Date"
          value={newBus.taxStartDate}
          onChange={handleInputChange}
          required
        />
        {errors.taxStartDate && <p className="error">{errors.taxStartDate}</p>}
        <input
          type="date"
          name="taxEndDate"
          placeholder="Tax End Date"
          value={newBus.taxEndDate}
          onChange={handleInputChange}
          required
        />
        {errors.taxEndDate && <p className="error">{errors.taxEndDate}</p>}

        {/* Permit Details */}
        <h4>Permit Details:</h4>
        <input
          type="date"
          name="permitStartDate"
          placeholder="Permit Start Date"
          value={newBus.permitStartDate}
          onChange={handleInputChange}
          required
        />
        {errors.permitStartDate && <p className="error">{errors.permitStartDate}</p>}
        <input
          type="date"
          name="permitEndDate"
          placeholder="Permit End Date"
          value={newBus.permitEndDate}
          onChange={handleInputChange}
          required
        />
        {errors.permitEndDate && <p className="error">{errors.permitEndDate}</p>}

      {/* <input
        type="file"
        name="photos"
        accept="image/*"
        onChange={handlePhotoChange}
      /> */}
        <button type="submit">{isEditing ? 'Update Bus' : 'Add Bus'}</button>
      </form>

      <table className="bus-table">
        <thead>
          <tr>
            <th>Bus ID</th>
            <th>Route ID</th>
            <th>Registration No</th>
            <th>Seat Capacity</th>
            <th>Status</th>
            <th>Pollution Start Date</th>
            <th>Pollution End Date</th>
            <th>Tax Start Date</th>
            <th>Tax End Date</th>
            <th>Permit Start Date</th>
            <th>Permit End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus._id}>
              <td>{bus.busId}</td>
              <td>{bus.routeId}</td>
              <td>{bus.regNo}</td>
              <td>{bus.seatCapacity}</td>
              <td className={bus.status === 'On Maintenance' ? 'maintenance' : 'ready'}>
                {bus.status}
              </td>
              <td>{bus.pollutionStartDate}</td>
              <td>{bus.pollutionEndDate}</td>
              <td>{bus.taxStartDate}</td>
              <td>{bus.taxEndDate}</td>
              <td>{bus.permitStartDate}</td>
              <td>{bus.permitEndDate}</td>
              <td>
                <button onClick={() => handleEditBus(bus)}>Edit</button>
                <button onClick={() => handleDeleteBus(bus._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusDetails;
