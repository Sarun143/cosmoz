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
    departureStop: '',
    departure: '',
    arrivalStop: '',
    arrival: '',
    distance: '',
    stops: [],
    frequency: 'all_day',
    selectedDays: [],
    selectedDates: [],
  });
  const [stopInputs, setStopInputs] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingRoute, setEditingRoute] = useState(null);

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

  const handleEditRoute = (route) => {
    setEditingRoute(route);
    setNewRoute({
      routeId: route.routeId,
      name: route.name,
      departureStop: route.departureStop,
      departure: route.departure,
      arrivalStop: route.arrivalStop,
      arrival: route.arrival,
      distance: route.totaldistance,
      stops: route.stops,
      frequency: route.frequency,
      selectedDays: route.selectedDays || [],
      selectedDates: route.selectedDates || [],
    });
    setStopInputs(route.stops.map(stop => ({
      stop: stop.stop,
      arrival: stop.arrival,
      distance: stop.distance,
    })));
  };
  

  const validateField = (name, value) => {
    let error = '';
    if (name === 'name' && !value) error = 'Route name is required';
    if (name === 'departureStop' && !value) error = 'Departure stop is required';
    if (name === 'departure' && !value) error = 'Departure time is required';
    if (name === 'arrival' && !value) error = 'Arrival time is required';
    if (name === 'distance' && (!value || isNaN(value) || value <= 0)) error = 'Valid distance is required';

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    ['name', 'departureStop', 'departure', 'arrival', 'distance'].forEach((field) => {
      if (!newRoute[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const formatStops = (stops) => {
    return stops.map((stop, index) => {
      if (index === 0) {
        return `From Departure to ${stop.stop}: ${stop.distance} km, Arrival: ${stop.arrival}`;

      } else {
        return `From ${stops[index - 1].stop} to ${stop.stop}: ${stop.distance} km,Arrival : ${stop.arrival}`;
      }
    });
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoute((prevRoute) => ({
      ...prevRoute,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleAddStop = () => {
    setStopInputs((prev) => [...prev, { stop: '', arrival: '', distance: '' }]);
  };

  const handleStopInputChange = (index, field, value) => {
    setStopInputs((prev) => {
      const updatedStops = [...prev];
      updatedStops[index][field] = value;
      return updatedStops;
    });
  };

  const calculateTotalDistance = () => {
    return stopInputs.reduce((total, stop) => total + (parseFloat(stop.distance) || 0), 0);
  };

  const handleCreateRoute = async () => {
    if (!validateForm()) return;

    const totalStopDistance = calculateTotalDistance();
    if (parseFloat(newRoute.distance) < totalStopDistance) {
      setErrors({ distance: 'Total route distance should be at least the sum of all stops' });
      return;
    }

    const stops = stopInputs.map((input) => ({
      stop: input.stop,
      arrival: input.arrival,
      distance: parseFloat(input.distance) || 0,
    }));

    try {
      const response = await axios.post('http://localhost:5000/api/routes', {
        ...newRoute,
        stops,
      });
      setRoutes([...routes, response.data]);
      resetForm();
    } catch (error) {
      console.error('Error creating route:', error);
    }
  };

  
  const handleUpdateRoute = async () => {
    if (!validateForm()) return;

    const totalStopDistance = calculateTotalDistance();
    if (parseFloat(newRoute.distance) < totalStopDistance) {
      setErrors({ distance: 'Total route distance should be at least the sum of all stops' });
    }

    const stops = stopInputs.map((input) => ({
      stop: input.stop,
      arrival: input.arrival,
      distance: parseFloat(input.distance) || 0,
    }));

    const formatStopsWithArrival = (stops) => {
      return stops.map((stop) => `${stop.stopName} (${stop.arrivalTime})`);
    };

    const formatStopArrivalTimes = (stops) => stops.map(stop => stop.arrivalTime);

    try {
      const response = await axios.put(`http://localhost:5000/api/routes/${editingRoute._id}`, {
        ...newRoute,
        stops,
      });
      setRoutes(routes.map((route) => (route._id === editingRoute._id ? response.data : route)));
      resetForm();
    } catch (error) {
      console.error('Error updating route:', error);
    }
  };

  const handleDelete = async (routeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/routes/${routeId}`);
      setRoutes(routes.filter((route) => route._id !== routeId));
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  const resetForm = () => {
    setNewRoute({
      routeId: routes.length + 2,
      name: '',
      departureStop: '',
      departure: '',
      arrivalStop: '',
      arrival: '',
      distance: '',
      stops: [],
      frequency: 'all_day',
      selectedDays: [],
      selectedDates: [],
    });
    setStopInputs([]);
    setEditingRoute(null);
  };

  // Add this new function to handle frequency change
  const handleFrequencyChange = (e) => {
    const frequency = e.target.value;
    setNewRoute((prevRoute) => ({
      ...prevRoute,
      frequency,
      selectedDays: frequency === 'particular_days' ? prevRoute.selectedDays : [],
      selectedDates: frequency === 'particular_dates' ? prevRoute.selectedDates : [],
    }));
  };

  // Add these new functions to handle day and date selection
  const handleDaySelection = (day) => {
    setNewRoute((prevRoute) => ({
      ...prevRoute,
      selectedDays: prevRoute.selectedDays.includes(day)
        ? prevRoute.selectedDays.filter((d) => d !== day)
        : [...prevRoute.selectedDays, day],
    }));
  };

  const handleDateSelection = (date) => {
    setNewRoute((prevRoute) => ({
      ...prevRoute,
      selectedDates: prevRoute.selectedDates.includes(date)
        ? prevRoute.selectedDates.filter((d) => d !== date)
        : [...prevRoute.selectedDates, date],
    }));
  };

  // Add this helper function to format the frequency information
  const formatFrequency = (route) => {
    switch (route.frequency) {
      case 'all_day':
        return 'All Day';
      case 'particular_days':
        return `On ${route.selectedDays.join(', ')}`;
      case 'particular_dates':
        return `On ${route.selectedDates.map(date => new Date(date).toLocaleDateString()).join(', ')}`;
      default:
        return 'N/A';
    }
  };

  // Add this function to get all unique stops from all routes
  const getAllUniqueStops = () => {
    const stopsSet = new Set();
    
    routes.forEach(route => {
      // Add departure and arrival stops
      stopsSet.add(route.departureStop);
      stopsSet.add(route.arrivalStop);
      
      // Add intermediate stops
      route.stops.forEach(stop => {
        stopsSet.add(stop.stop);
      });
    });

    return Array.from(stopsSet);
  };

  // Export stops data through localStorage or context
  useEffect(() => {
    const allStops = getAllUniqueStops();
    localStorage.setItem('allStops', JSON.stringify(allStops));
  }, [routes]);

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
            value={newRoute.departureStop}
            placeholder="Departure Stop"
            onChange={handleInputChange}
          />
          {errors.departureStop && <p className="error">{errors.departureStop}</p>}
          <input
            type="time"
            name="departure"
            value={newRoute.departure}
            onChange={handleInputChange}
          />
          {errors.departure && <p className="error">{errors.departure}</p>}
          <input
            type="text"
            name="arrivalStop"
            value={newRoute.arrivalStop}
            placeholder="Arrival Stop"
            onChange={handleInputChange}
          />
          <input
            type="time"
            name="arrival"
            value={newRoute.arrival}
            onChange={handleInputChange}
          />
          {errors.arrival && <p className="error">{errors.arrival}</p>}
          <input
            type="number"
            name="distance"
            value={newRoute.distance}
            placeholder="Total Distance (km)"
            onChange={handleInputChange}
            min={0}
          />
          {errors.distance && <p className="error">{errors.distance}</p>}

          {stopInputs.map((input, index) => (
            <div key={index} className="stop-inputs">
              <input
                type="text"
                value={input.stop}
                placeholder="Add Stop"
                onChange={(e) => handleStopInputChange(index, 'stop', e.target.value)}
              />
              <input
                type="time"
                value={input.arrival}
                placeholder="Add Arrival Time"
                onChange={(e) => handleStopInputChange(index, 'arrival', e.target.value)}
              />
              <input
                type="number"
                value={input.distance}
                placeholder="Distance from Last Stop (km)"
                onChange={(e) => handleStopInputChange(index, 'distance', e.target.value)}
                min={0}
              />
            </div>
          ))}
          <button onClick={handleAddStop}>Add Stop</button>

          {/* Add frequency selection */}
          <select
            name="frequency"
            value={newRoute.frequency}
            onChange={handleFrequencyChange}
          >
            <option value="all_day">All Day</option>
            <option value="particular_days">Particular Days</option>
            <option value="particular_dates">Particular Dates</option>
          </select>

          {/* Add day selection for 'particular_days' frequency */}
          {newRoute.frequency === 'particular_days' && (
            <div className="day-selection">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <label key={day}>
                  <input
                    type="checkbox"
                    checked={newRoute.selectedDays.includes(day)}
                    onChange={() => handleDaySelection(day)}
                  />
                  {day}
                </label>
              ))}
            </div>
          )}

          {/* Add date selection for 'particular_dates' frequency */}
          {newRoute.frequency === 'particular_dates' && (
            <div className="date-selection">
              <input
                type="date"
                onChange={(e) => handleDateSelection(e.target.value)}
              />
              <div>
                {newRoute.selectedDates.map((date) => (
                  <span key={date} onClick={() => handleDateSelection(date)}>
                    {new Date(date).toLocaleDateString()} &#x2715;
                  </span>
                ))}
              </div>
            </div>
          )}

          {editingRoute ? (
            <button onClick={handleUpdateRoute}>Update Route</button>
          ) : (
            <button onClick={handleCreateRoute}>Create Route</button>
          )}
        </div>

        <h3>Existing Routes</h3>
        <table className="route-table">
          <thead>
            <tr>
              <th>Route ID</th>
              <th>Name</th>
              <th>Departure Stop</th>
              <th>Departure Time</th>
              <th>Arrival Stop</th>
              <th>Arrival Time</th>
              <th>Total Distance</th>
              <th>Stops</th>
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
                <td>{route.arrivalStop}</td>
                <td>{route.arrival}</td>
                <td>{route.totaldistance} km</td>
                <td>{formatStops(route.stops).join(', ')}</td>
                <td>{formatFrequency(route)}</td>
                <td>
                  <button onClick={() => handleEditRoute(route)}>Edit</button>
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
