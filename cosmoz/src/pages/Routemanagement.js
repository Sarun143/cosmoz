import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RouteManagement.css';
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoute(prevRoute => ({
      ...prevRoute,
      [name]: value
    }));
  };

  const handleCreateRoute = async () => {
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/routes/${id}`);
      setRoutes(routes.filter(route => route._id !== id));
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

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

  const handleUpdateRoute = async () => {
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
          <input
            type="text"
            name="name"
            value={newRoute.name}
            placeholder="Route Name"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="departure"
            value={newRoute.departure}
            placeholder="Departure Time"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="arrival"
            value={newRoute.arrival}
            placeholder="Arrival Time"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="stops"
            value={newRoute.stops}
            placeholder="Stops (comma separated)"
            onChange={handleInputChange}
          />
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
