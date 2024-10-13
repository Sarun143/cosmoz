import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RouteManagement.css';
import Sidebar from '../components/Sidebar'; // Sidebar component is used here

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [newRoute, setNewRoute] = useState({
    name: '',
    departure: '',
    arrival: '',
    stops: ''
  });

  // Fetch routes from the backend when component mounts
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/routes'); // Your backend endpoint
        setRoutes(response.data); // Set the fetched routes to the state
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchRoutes();
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleDelete = (id) => {
    const updatedRoutes = routes.filter(route => route.id !== id);
    setRoutes(updatedRoutes);
  };

  const handleUpdate = (id) => {
    // Update logic here
  };

  const handleSchedule = (id) => {
    // Schedule logic here
  };

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
      name: newRoute.name,
      departure: newRoute.departure,
      arrival: newRoute.arrival,
      stops: stopsArray
    };

    try {
      const response = await axios.post('http://localhost:5000/api/routes', newRouteData);
      setRoutes([...routes, response.data]); // Add the new route to the state
      setNewRoute({ name: '', departure: '', arrival: '', stops: '' }); // Reset form fields
    } catch (error) {
      console.error('Error creating route:', error);
    }
  };

  return (
    <div className="route-management-container">
      <Sidebar />
      <div className="route-management">
        <h2>Manage Routes</h2>

        <div className="create-route">
          <h3>Create New Route</h3>
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
          <button onClick={handleCreateRoute}>Create Route</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Route Name</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Stops</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(route => (
              <tr key={route._id}> {/* Make sure to use _id for MongoDB */}
                <td>{route.name}</td>
                <td>{route.departure}</td>
                <td>{route.arrival}</td>
                <td>{route.stops.join(', ')}</td>
                <td>
                  <button onClick={() => handleSchedule(route._id)}>Schedule</button>
                  <button onClick={() => handleUpdate(route._id)}>Update</button>
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
