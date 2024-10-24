import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RouteManagement.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [newRoute, setNewRoute] = useState({
    routeId: '',
    name: '',
    departureStop: '', // Changed key from 'departurestop' to 'departureStop' for consistency
    departure: '',
    arrivalStop: '',
    arrival: '',
    stops: []
  });
  const [stopInput, setStopInput] = useState(''); // For stop name input
  const [arrivalInput, setArrivalInput] = useState(''); // For arrival time input
  const [errors, setErrors] = useState({});
  const [editingRoute, setEditingRoute] = useState(null);
  const [frequency, setFrequency] = useState('all_day');
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/routes');
        setRoutes(response.data);
        const nextRouteId = response.data.length + 1;
        setNewRoute((prevRoute) => ({ ...prevRoute, routeId: nextRouteId }));
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  const validateField = (name, value) => {
    let error = '';
    if (name === 'name' && !value) error = 'Route name is required';
    if (name === 'departureStop' && !value) error = 'Departure stop is required';
    if (name === 'departure' && !value) error = 'Departure time is required';
    if (name === 'arrival' && !value) error = 'Arrival time is required';

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoute((prevRoute) => ({
      ...prevRoute,
      [name]: value
    }));
    validateField(name, value);
  };

  const validateStopAndArrival = () => {
    let stopError = '';
    let arrivalError = '';
    if (!stopInput.trim()) stopError = 'Stop name is required';
    if (!arrivalInput.trim()) arrivalError = 'Arrival time is required';
    
    setErrors((prevErrors) => ({
      ...prevErrors,
      stop: stopError,
      arrival: arrivalError
    }));
    
    return !stopError && !arrivalError;
  };

  const handleStopInputChange = (e) => {
    setStopInput(e.target.value);
  };

  const handleArrivalInputChange = (e) => {
    setArrivalInput(e.target.value);
  };

  const handleAddStop = () => {
    if (validateStopAndArrival()) {
      setNewRoute((prevRoute) => ({
        ...prevRoute,
        stops: [...prevRoute.stops, { stop: stopInput.trim(), arrival: arrivalInput.trim() }]
      }));
      setStopInput(''); // Clear stop input box
      setArrivalInput(''); // Clear arrival time input box
    }
  };

  const handleRemoveStop = (index) => {
    setNewRoute((prevRoute) => ({
      ...prevRoute,
      stops: prevRoute.stops.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!newRoute.name) formErrors.name = 'Route name is required';
    if (!newRoute.departure) formErrors.departure = 'Departure time is required';
    if (!newRoute.arrival) formErrors.arrival = 'Arrival time is required';
    if (newRoute.stops.length === 0) formErrors.stops = 'At least one stop with arrival time is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleFrequencyChange = (e) => {
    setFrequency(e.target.value);
    // Reset selected days and dates when changing frequency
    setSelectedDays([]);
    setSelectedDates([]);
  };

  const handleDayChange = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleDateChange = (date) => {
    setSelectedDates(prev => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const handleCreateRoute = async () => {
    if (!validateForm()) return;

    const newRouteData = {
      routeId: newRoute.routeId,
      name: newRoute.name,
      departureStop: newRoute.departureStop, // Changed key here to match newRoute object
      departure: newRoute.departure,
      arrivalStop: newRoute.arrivalStop,
      arrival: newRoute.arrival,
      stops: newRoute.stops,
      frequency,
      selectedDays: frequency === 'particular_days' ? selectedDays : [],
      selectedDates: frequency === 'particular_dates' ? selectedDates : [],
    };

    try {
      const response = await axios.post('http://localhost:5000/api/routes', newRouteData);
      setRoutes([...routes, response.data]);
      setNewRoute({
        routeId: routes.length + 2,
        name: '',
        departureStop: '', // Reset the departureStop
        departure: '',
        arrivalStop:'',
        arrival: '',
        stops: []
      });
    } catch (error) {
      console.error('Error creating route:', error);
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setNewRoute({
      routeId: route.routeId,
      name: route.name,
      departureStop: route.departureStop, // Ensure it uses correct key
      departure: route.departure,
      arrivalStop:route.arrivalStop,
      arrival: route.arrival,
      stops: route.stops
    });
  };

  const handleUpdateRoute = async () => {
    if (!validateForm()) return;

    const updatedRouteData = {
      routeId: newRoute.routeId,
      name: newRoute.name,
      departureStop: newRoute.departureStop, // Ensure it uses correct key
      departure: newRoute.departure,
      arrivalStop:newRoute.arrivalStop,
      arrival: newRoute.arrival,
      stops: newRoute.stops,
      frequency,
      selectedDays: frequency === 'particular_days' ? selectedDays : [],
      selectedDates: frequency === 'particular_dates' ? selectedDates : [],
    };

    try {
      const response = await axios.put(`http://localhost:5000/api/routes/${editingRoute._id}`, updatedRouteData);
      setRoutes(routes.map(route => (route._id === editingRoute._id ? response.data : route)));
      setNewRoute({
        routeId: routes.length + 1,
        name: '',
        departureStop: '', // Reset the departureStop
        departure: '',
        arrivalStop:'',
        arrival: '',
        stops: []
      });
      setEditingRoute(null);
    } catch (error) {
      console.error('Error updating route:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/routes/${id}`);
      setRoutes(routes.filter(route => route._id !== id));
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="route-management-container">
      <Header />
      <Sidebar />
      <div className="route-management">
        <h2>Manage Routes</h2>

        <div className="create-route">
          <h3>{editingRoute ? 'Edit Route' : 'Create New Route'}</h3>
          <input
            type="text"
            name="routeId"
            value={newRoute.routeId}
            placeholder="Route ID"
            readOnly
          />
          
          <input
            type="text"
            name="name"
            value={newRoute.name}
            placeholder="Route Name"
            onChange={handleInputChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}

          <input
            type="text"
            name="departureStop"
            value={newRoute.departureStop} // Changed key to match state object
            placeholder="Departure Stop"
            onChange={handleInputChange}
          />
          {errors.departureStop && <p className="error">{errors.departureStop}</p>}
          
          <input
            type="time"
            name="departure"
            value={newRoute.departure}
            placeholder="Departure Time"
            onChange={handleInputChange}
          />
          {errors.departure && <p className="error">{errors.departure}</p>}
          
          <input
          type='text'
          name='arrivalStop'
          value={newRoute.arrivalStop}
          placeholder="Arrival Stop"
          onChange={handleInputChange}
          />
          <input
            type="time"
            name="arrival"
            value={newRoute.arrival}
            placeholder="Arrival Time"
            onChange={handleInputChange}
          />
          {errors.arrival && <p className="error">{errors.arrival}</p>}
          
          {/* Stops section with arrival time */}
          <input
            type="text"
            value={stopInput}
            placeholder="Add a Stop"
            onChange={handleStopInputChange}
          />
          {errors.stop && <p className="error">{errors.stop}</p>}
          
          <input
            type="time"
            value={arrivalInput}
            placeholder="Add Arrival Time"
            onChange={handleArrivalInputChange}
          />
          {errors.arrival && <p className="error">{errors.arrival}</p>}

          <button onClick={handleAddStop}>+</button>
          
          {newRoute.stops.length > 0 && (
            <ul>
              {newRoute.stops.map((stopObj, index) => (
                <li key={index}>
                  {stopObj.stop} (Arrival: {stopObj.arrival})
                  <button onClick={() => handleRemoveStop(index)}>Remove</button>
                </li>
              ))}
            </ul>
          )}

          {errors.stops && <p className="error">{errors.stops}</p>}
          
          <select
            name="frequency"
            value={frequency}
            onChange={handleFrequencyChange}
          >
            <option value="all_day">All Day</option>
            <option value="particular_days">Particular Days</option>
            <option value="particular_dates">Particular Dates</option>
          </select>

          {frequency === 'particular_days' && (
            <div>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <label key={day}>
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(day)}
                    onChange={() => handleDayChange(day)}
                  /> {day}
                </label>
              ))}
            </div>
          )}

          {frequency === 'particular_dates' && (
            <input
              type="date"
              multiple
              onChange={(e) => handleDateChange(e.target.value)}
            />
          )}

          {editingRoute ? (
            <button onClick={handleUpdateRoute}>Update Route</button>
          ) : (
            <button onClick={handleCreateRoute}>Create Route</button>
          )}
        </div>

        <table>
          <thead>
            <tr>
              <th>Route ID</th>
              <th>Name</th>
              <th>Departure Stop</th>
              <th>Departure Time</th>
              <th>Stops</th>
              <th>Arrival Stop</th>
              <th>Arrival Time</th>
              <th>Frequency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route._id}>
                <td>{route.routeId}</td>
                <td>{route.name}</td>
                <td>{route.departureStop}</td>
                <td>{route.departure}</td>
                <td>
                  {route.stops.map((stopObj, index) => (
                    <div key={index}>{stopObj.stop} (Arrival: {stopObj.arrival})</div>
                  ))}
                </td>
                <td>{route.arrivalStop}</td>
                <td>{route.arrival}</td>
                <td>
                  {route.frequency === 'all_day' && 'All Day'}
                  {route.frequency === 'particular_days' && (
                    <>
                      Particular Days:
                      <br />
                      {route.selectedDays.join(', ')}
                    </>
                  )}
                  {route.frequency === 'particular_dates' && (
                    <>
                      Particular Dates:
                      <br />
                      {route.selectedDates.map(formatDate).join(', ')}
                    </>
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(route)}>Edit</button>
                  <button onClick={() => handleDelete(route._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RouteManagement;
