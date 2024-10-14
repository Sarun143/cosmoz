import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RouteManagement.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar'; // Assuming Sidebar is a separate component

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [newRoute, setNewRoute] = useState({
    routeId: '',
    name: '',
    departure: '',
    arrival: '',
    stops: ''
  });
  const [errors, setErrors] = useState({}); // To hold validation error messages
  const [editingRoute, setEditingRoute] = useState(null); // For handling updates

  // Fetch routes from the backend when the component mounts
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/routes');
        setRoutes(response.data);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  // Inline validation for each field
  const validateField = (name, value) => {
    let error = '';
    if (name === 'routeId' && !value) error = 'Route ID is required';
    if (name === 'name' && !value) error = 'Route name is required';
    if (name === 'departure' && !value) error = 'Departure time is required';
    if (name === 'arrival' && !value) error = 'Arrival time is required';
    if (name === 'stops' && !value) error = 'At least one stop is required';

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error
    }));
  };

  // Function to handle input change and inline validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoute((prevRoute) => ({
      ...prevRoute,
      [name]: value
    }));
    validateField(name, value); // Validate the field as user types
  };

  // Validate all fields before form submission
  const validateForm = () => {
    let formErrors = {};
    if (!newRoute.routeId) formErrors.routeId = 'Route ID is required';
    if (!newRoute.name) formErrors.name = 'Route name is required';
    if (!newRoute.departure) formErrors.departure = 'Departure time is required';
    if (!newRoute.arrival) formErrors.arrival = 'Arrival time is required';
    if (!newRoute.stops) formErrors.stops = 'At least one stop is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Return true if no errors
  };

  // Function to create a new route
  const handleCreateRoute = async () => {
    if (!validateForm()) return; // Don't proceed if form is invalid

    const stopsArray = newRoute.stops.split(',').map(stop => stop.trim());
    const newRouteData = {
      routeId: newRoute.routeId,
      name: newRoute.name,
      departure: newRoute.departure,
      arrival: newRoute.arrival,
      stops: stopsArray
    };

    try {
      const response = await axios.post('http://localhost:5000/api/routes', newRouteData);
      setRoutes([...routes, response.data]);
      setNewRoute({ routeId: '', name: '', departure: '', arrival: '', stops: '' });
    } catch (error) {
      console.error('Error creating route:', error);
    }
  };

  // Function to delete a route
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/routes/${id}`);
      setRoutes(routes.filter(route => route._id !== id));
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  // Function to handle editing a route
  const handleEdit = (route) => {
    setEditingRoute(route);
    setNewRoute({
      routeId: route.routeId,
      name: route.name,
      departure: route.departure,
      arrival: route.arrival,
      stops: route.stops.join(', ')
    });
  };

  // Function to update an existing route
  const handleUpdateRoute = async () => {
    if (!validateForm()) return; // Don't proceed if form is invalid

    const stopsArray = newRoute.stops.split(',').map(stop => stop.trim());
    const updatedRouteData = {
      routeId: newRoute.routeId,
      name: newRoute.name,
      departure: newRoute.departure,
      arrival: newRoute.arrival,
      stops: stopsArray
    };

    try {
      const response = await axios.put(`http://localhost:5000/api/routes/${editingRoute._id}`, updatedRouteData);
      setRoutes(routes.map(route => (route._id === editingRoute._id ? response.data : route)));
      setNewRoute({ routeId: '', name: '', departure: '', arrival: '', stops: '' });
      setEditingRoute(null);
    } catch (error) {
      console.error('Error updating route:', error);
    }
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
            onChange={handleInputChange}
          />
          {errors.routeId && <p className="error">{errors.routeId}</p>}
          
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
            name="departure"
            value={newRoute.departure}
            placeholder="Departure Time"
            onChange={handleInputChange}
          />
          {errors.departure && <p className="error">{errors.departure}</p>}
          
          <input
            type="text"
            name="arrival"
            value={newRoute.arrival}
            placeholder="Arrival Time"
            onChange={handleInputChange}
          />
          {errors.arrival && <p className="error">{errors.arrival}</p>}
          
          <input
            type="text"
            name="stops"
            value={newRoute.stops}
            placeholder="Stops (comma separated)"
            onChange={handleInputChange}
          />
          {errors.stops && <p className="error">{errors.stops}</p>}
          
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
              <th>Route Name</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Stops</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(route => (
              <tr key={route._id}>
                <td>{route.routeId}</td> {/* Display the route ID */}
                <td>{route.name}</td>
                <td>{route.departure}</td>
                <td>{route.arrival}</td>
                <td>{route.stops.join(', ')}</td>
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
