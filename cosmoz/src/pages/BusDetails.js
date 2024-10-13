import React, { useState } from 'react';
import './BusDetails.css';
import Sidebar from '../components/Sidebar';

const BusDetails = () => {
  const [buses, setBuses] = useState([
    {
      busId: 'BUS001',
      routeId: 'RT001',
      regNo: 'ABC1234',
      seatCapacity: 50,
      status: 'Ready for Service',
    },
    {
      busId: 'BUS002',
      routeId: 'RT002',
      regNo: 'XYZ5678',
      seatCapacity: 45,
      status: 'On Maintenance',
    },
  ]);

  const [newBus, setNewBus] = useState({
    busId: '',
    routeId: '',
    regNo: '',
    seatCapacity: '',
    status: 'Ready for Service', // default status
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBus({ ...newBus, [name]: value });
  };

  const handleAddBus = (e) => {
    e.preventDefault();
    if (
      newBus.busId &&
      newBus.routeId &&
      newBus.regNo &&
      newBus.seatCapacity &&
      newBus.status
    ) {
      setBuses([...buses, newBus]);
      setNewBus({
        busId: '',
        routeId: '',
        regNo: '',
        seatCapacity: '',
        status: 'Ready for Service',
      });
    }
  };

  return (
    <div className="bus-details-container">
      <Sidebar />
      <h1>Bus Details</h1>

      {/* Form to add new bus */}
      <form className="add-bus-form" onSubmit={handleAddBus}>
        <input
          type="text"
          name="busId"
          placeholder="Bus ID"
          value={newBus.busId}
          onChange={handleInputChange}
          required
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
          placeholder="Seat Capacity"
          value={newBus.seatCapacity}
          onChange={handleInputChange}
          required
        />
        <select name="status" value={newBus.status} onChange={handleInputChange} required>
          <option value="Ready for Service">Ready for Service</option>
          <option value="On Maintenance">On Maintenance</option>
        </select>
        <button type="submit">Add Bus</button>
      </form>

      <table className="bus-table">
        <thead>
          <tr>
            <th>Bus ID</th>
            <th>Route ID</th>
            <th>Registration No</th>
            <th>Seat Capacity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus, index) => (
            <tr key={index}>
              <td>{bus.busId}</td>
              <td>{bus.routeId}</td>
              <td>{bus.regNo}</td>
              <td>{bus.seatCapacity}</td>
              <td className={bus.status === 'On Maintenance' ? 'maintenance' : 'ready'}>
                {bus.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusDetails;
