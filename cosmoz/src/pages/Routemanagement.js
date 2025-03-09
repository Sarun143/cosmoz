import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RouteManagement.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [newRoute, setNewRoute] = useState({
    routeName: '',
    startLocation: {
      name: '',
      coordinates: []
    },
    endLocation: {
      name: '',
      coordinates: []
    },
    startTime: '',
    endTime: '',
    serviceDays: [],
    distance: 0,
    estimatedTime: '',
    busAssigned: '',
    status: 'Active',
    staffs: []
  });

  const [stops, setStops] = useState([]);
  const [newStop, setNewStop] = useState({
    name: '',
    coordinates: [],
    arrivalTime: '',
    busTripRoute: '',
    fare: 0,
    isBoardingPoint: false,
    isTopStation: false
  });

  const [errors, setErrors] = useState({});
  const [editingRoute, setEditingRoute] = useState(null);

  const [buses, setBuses] = useState([]);
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    fetchRoutes();
    fetchBuses();
    fetchStaff();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/routes');
      console.log('Routes response:', response.data);
      
      if (Array.isArray(response.data)) {
        const transformedRoutes = response.data.map(route => ({
          _id: route._id,
          routeName: route.name,
          startLocation: {
            name: route.departureStop,
            coordinates: []
          },
          endLocation: {
            name: route.arrivalStop,
            coordinates: []
          },
          startTime: route.departure,
          endTime: route.arrival,
          serviceDays: route.selectedDays || [],
          distance: route.totaldistance,
          status: route.status || 'Active',
          busAssigned: route.busAssigned,
          staffs: route.staffs || [],
          stops: route.stops || []
        }));

        setRoutes(transformedRoutes);
      } else {
        console.error('Invalid response format:', response.data);
        alert('Failed to fetch routes: Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      alert(`Failed to fetch routes: ${error.response?.data?.message || error.message}`);
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/buses/all/buses');
      // Filter only Active buses
      const activeBuses = response.data.filter(bus => bus.status === 'Active');
      setBuses(activeBuses);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vstaff');
      // Filter staff by role if needed
      const staffData = response.data;
      setStaffList(staffData);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const validateRoute = () => {
    const errors = {};
    if (!newRoute.routeName) errors.routeName = 'Route name is required';
    if (!newRoute.startLocation.name) errors.startLocation = 'Start location is required';
    if (!newRoute.endLocation.name) errors.endLocation = 'End location is required';
    if (!newRoute.startTime) errors.startTime = 'Start time is required';
    if (!newRoute.endTime) errors.endTime = 'End time is required';
    if (!newRoute.distance) errors.distance = 'Distance is required';
    if (newRoute.serviceDays.length === 0) errors.serviceDays = 'Select at least one service day';
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewRoute(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setNewRoute(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleServiceDayChange = (day) => {
    setNewRoute(prev => ({
      ...prev,
      serviceDays: prev.serviceDays.includes(day)
        ? prev.serviceDays.filter(d => d !== day)
        : [...prev.serviceDays, day]
    }));
  };

  const handleStopChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStop(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingRoute) {
      await handleUpdate(e);
    } else {
      if (!validateRoute()) return;

      try {
        console.log('Preparing to submit route...');
        
        const formattedStops = stops.map(stop => ({
          stop: stop.name,
          arrival: stop.arrivalTime,
          coordinates: stop.coordinates,
          distance: parseFloat(stop.fare) || 0
        }));

        const totalDistance = parseFloat(newRoute.distance);
        if (isNaN(totalDistance) || totalDistance <= 0) {
          alert('Please enter a valid distance greater than 0');
          return;
        }

        // Create a unique routeId using timestamp to avoid conflicts
        const timestamp = new Date().getTime();
        const routeId = `${newRoute.routeName.replace(/\s+/g, '-').toLowerCase()}-${timestamp}`;

        const routeData = {
          routeId: routeId,
          name: newRoute.routeName,
          departureStop: newRoute.startLocation.name,
          departure: newRoute.startTime,
          arrivalStop: newRoute.endLocation.name,
          arrival: newRoute.endTime,
          startLocation: {
            name: newRoute.startLocation.name,
            coordinates: newRoute.startLocation.coordinates
          },
          endLocation: {
            name: newRoute.endLocation.name,
            coordinates: newRoute.endLocation.coordinates
          },
          stops: formattedStops,
          frequency: "daily",
          selectedDays: newRoute.serviceDays,
          selectedDates: [],
          totaldistance: totalDistance,
          busAssigned: newRoute.busAssigned || null,
          staffs: newRoute.staffs || [],
          status: newRoute.status || 'Active'
        };

        console.log('Submitting route data:', routeData);

        const response = await axios.post('http://localhost:5000/api/routes/new-route', routeData);
        console.log('Route creation response:', response.data);

        if (response.data) {
          // Transform the response data to match the table structure
          const newRouteForTable = {
            _id: response.data._id,
            routeName: response.data.name,
            startLocation: {
              name: response.data.departureStop,
              coordinates: response.data.startLocation?.coordinates || []
            },
            endLocation: {
              name: response.data.arrivalStop,
              coordinates: response.data.endLocation?.coordinates || []
            },
            startTime: response.data.departure,
            endTime: response.data.arrival,
            distance: response.data.totaldistance,
            status: response.data.status,
            serviceDays: response.data.selectedDays,
            busAssigned: response.data.busAssigned,
            staffs: response.data.staffs,
            stops: response.data.stops
          };

          setRoutes(prevRoutes => [...prevRoutes, newRouteForTable]);
          alert('Route created successfully!');
          resetForm();
        }

      } catch (error) {
        console.error('Error creating route:', error.response?.data || error.message);
        alert(`Failed to create route: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const resetForm = () => {
    setNewRoute({
      routeName: '',
      startLocation: { name: '', coordinates: [] },
      endLocation: { name: '', coordinates: [] },
      startTime: '',
      endTime: '',
      serviceDays: [],
      distance: 0,
      estimatedTime: '',
      busAssigned: '',
      status: 'Active',
      staffs: []
    });
    setStops([]);
    setErrors({});
    setEditingRoute(null);
  };

  const handleDelete = async (routeId) => {
    if (!window.confirm('Are you sure you want to delete this route?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/routes/${routeId}`);
      setRoutes(prevRoutes => prevRoutes.filter(route => route._id !== routeId));
      alert('Route deleted successfully!');
    } catch (error) {
      console.error('Error deleting route:', error);
      alert(`Failed to delete route: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    // Populate the form with the route data
    setNewRoute({
      routeName: route.routeName,
      startLocation: route.startLocation,
      endLocation: route.endLocation,
      startTime: route.startTime,
      endTime: route.endTime,
      serviceDays: route.serviceDays || [],
      distance: route.distance,
      estimatedTime: route.estimatedTime || '',
      busAssigned: route.busAssigned || '',
      status: route.status || 'Active',
      staffs: route.staffs || []
    });
    // Populate stops
    setStops(route.stops.map(stop => ({
      name: stop.stop,
      coordinates: [],
      arrivalTime: stop.arrival,
      fare: stop.distance,
      isBoardingPoint: false,
      isTopStation: false
    })));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateRoute()) return;

    try {
      const formattedStops = stops.map(stop => ({
        stop: stop.name,
        arrival: stop.arrivalTime,
        coordinates: stop.coordinates,
        distance: parseFloat(stop.fare) || 0
      }));

      const routeData = {
        name: newRoute.routeName,
        departureStop: newRoute.startLocation.name,
        departure: newRoute.startTime,
        arrivalStop: newRoute.endLocation.name,
        arrival: newRoute.endTime,
        startLocation: {
          name: newRoute.startLocation.name,
          coordinates: newRoute.startLocation.coordinates
        },
        endLocation: {
          name: newRoute.endLocation.name,
          coordinates: newRoute.endLocation.coordinates
        },
        stops: formattedStops,
        frequency: "daily",
        selectedDays: newRoute.serviceDays,
        selectedDates: [],
        distance: parseFloat(newRoute.distance),
        busAssigned: newRoute.busAssigned || null,
        staffs: newRoute.staffs || [],
        status: newRoute.status
      };

      const response = await axios.put(`http://localhost:5000/api/routes/${editingRoute._id}`, routeData);

      if (response.data) {
        // Update the routes list with the edited route
        setRoutes(prevRoutes => prevRoutes.map(route => 
          route._id === editingRoute._id ? {
            ...route,
            routeName: response.data.name,
            startLocation: {
              name: response.data.departureStop,
              coordinates: response.data.startLocation?.coordinates || []
            },
            endLocation: {
              name: response.data.arrivalStop,
              coordinates: response.data.endLocation?.coordinates || []
            },
            startTime: response.data.departure,
            endTime: response.data.arrival,
            distance: response.data.totaldistance,
            status: response.data.status,
            serviceDays: response.data.selectedDays,
            busAssigned: response.data.busAssigned,
            staffs: response.data.staffs,
            stops: response.data.stops
          } : route
        ));

        alert('Route updated successfully!');
        resetForm();
      }
    } catch (error) {
      console.error('Error updating route:', error);
      alert(`Failed to update route: ${error.response?.data?.message || error.message}`);
    }
  };

  // Add this helper function to calculate total stop distance
  const calculateTotalStopDistance = () => {
    return stops.reduce((acc, stop) => acc + (Number(stop.fare) || 0), 0);
  };

  return (
    <div className="route-management-container">
      <Header />
      <Sidebar />
      <div className="route-management">
        <h2>Route Management</h2>
        
        <form onSubmit={handleSubmit} className="route-form">
          <div className="form-group">
            <label>Route Name</label>
            <input
              type="text"
              name="routeName"
              value={newRoute.routeName}
              onChange={handleInputChange}
              placeholder="Enter route name"
            />
            {errors.routeName && <span className="error">{errors.routeName}</span>}
          </div>

          <div className="form-group">
            <label>Start Location</label>
            <input
              type="text"
              name="startLocation.name"
              value={newRoute.startLocation.name}
              onChange={handleInputChange}
              placeholder="Enter start location"
            />
            <div className="coordinates-input">
              <input
                type="number"
                name="startLocation.coordinates.0"
                value={newRoute.startLocation.coordinates[0] || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewRoute(prev => ({
                    ...prev,
                    startLocation: {
                      ...prev.startLocation,
                      coordinates: [parseFloat(value), prev.startLocation.coordinates[1] || 0]
                    }
                  }));
                }}
                placeholder="Latitude"
                step="any"
              />
              <input
                type="number"
                name="startLocation.coordinates.1"
                value={newRoute.startLocation.coordinates[1] || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewRoute(prev => ({
                    ...prev,
                    startLocation: {
                      ...prev.startLocation,
                      coordinates: [prev.startLocation.coordinates[0] || 0, parseFloat(value)]
                    }
                  }));
                }}
                placeholder="Longitude"
                step="any"
              />
            </div>
          </div>

          <div className="form-group">
            <label>End Location</label>
            <input
              type="text"
              name="endLocation.name"
              value={newRoute.endLocation.name}
              onChange={handleInputChange}
              placeholder="Enter end location"
            />
            <div className="coordinates-input">
              <input
                type="number"
                name="endLocation.coordinates.0"
                value={newRoute.endLocation.coordinates[0] || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewRoute(prev => ({
                    ...prev,
                    endLocation: {
                      ...prev.endLocation,
                      coordinates: [parseFloat(value), prev.endLocation.coordinates[1] || 0]
                    }
                  }));
                }}
                placeholder="Latitude"
                step="any"
              />
              <input
                type="number"
                name="endLocation.coordinates.1"
                value={newRoute.endLocation.coordinates[1] || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewRoute(prev => ({
                    ...prev,
                    endLocation: {
                      ...prev.endLocation,
                      coordinates: [prev.endLocation.coordinates[0] || 0, parseFloat(value)]
                    }
                  }));
                }}
                placeholder="Longitude"
                step="any"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              name="startTime"
              value={newRoute.startTime}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              name="endTime"
              value={newRoute.endTime}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Service Days</label>
            <div className="service-days">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <label key={day}>
                  <input
                    type="checkbox"
                    checked={newRoute.serviceDays.includes(day)}
                    onChange={() => handleServiceDayChange(day)}
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Distance (km)</label>
            <input
              type="number"
              name="distance"
              value={newRoute.distance}
              onChange={handleInputChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Estimated Time</label>
            <input
              type="text"
              name="estimatedTime"
              value={newRoute.estimatedTime}
              onChange={handleInputChange}
              placeholder="HH:MM format"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={newRoute.status} onChange={handleInputChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label>Assign Bus</label>
            <select
              name="busAssigned"
              value={newRoute.busAssigned}
              onChange={handleInputChange}
            >
              <option value="">Select Bus</option>
              {buses.map(bus => (
                <option key={bus._id} value={bus._id}>
                  {bus.registrationNumber} - {bus.type} ({bus.status})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Assign Staff</label>
            <select
              multiple
              name="staffs"
              value={newRoute.staffs}
              onChange={(e) => {
                const selectedStaff = Array.from(e.target.selectedOptions, option => option.value);
                setNewRoute(prev => ({
                  ...prev,
                  staffs: selectedStaff
                }));
              }}
              className="staff-select"
            >
              <option value="">Select Staff</option>
              {staffList.map(staff => (
                <option key={staff._id} value={staff._id}>
                  {staff.name} - {staff.role}
                </option>
              ))}
            </select>
            <small>Hold Ctrl/Cmd to select multiple staff members</small>
            {errors.staffs && <span className="error">{errors.staffs}</span>}
          </div>

          <h3>Add Stops</h3>
          {stops.map((stop, index) => (
            <div key={index} className="stop-form">
              <input
                type="text"
                placeholder="Stop name"
                value={stop.name}
                onChange={(e) => {
                  const newStops = [...stops];
                  newStops[index].name = e.target.value;
                  setStops(newStops);
                }}
              />
              <div className="coordinates-input">
                <input
                  type="number"
                  placeholder="Latitude"
                  value={stop.coordinates[0] || ''}
                  onChange={(e) => {
                    const newStops = [...stops];
                    newStops[index].coordinates = [
                      parseFloat(e.target.value),
                      newStops[index].coordinates[1] || 0
                    ];
                    setStops(newStops);
                  }}
                  step="any"
                />
                <input
                  type="number"
                  placeholder="Longitude"
                  value={stop.coordinates[1] || ''}
                  onChange={(e) => {
                    const newStops = [...stops];
                    newStops[index].coordinates = [
                      newStops[index].coordinates[0] || 0,
                      parseFloat(e.target.value)
                    ];
                    setStops(newStops);
                  }}
                  step="any"
                />
              </div>
              <input
                type="time"
                value={stop.arrivalTime}
                onChange={(e) => {
                  const newStops = [...stops];
                  newStops[index].arrivalTime = e.target.value;
                  setStops(newStops);
                }}
              />
              <input
                type="number"
                placeholder="Fare"
                value={stop.fare}
                onChange={(e) => {
                  const newStops = [...stops];
                  newStops[index].fare = e.target.value;
                  setStops(newStops);
                }}
              />
              <div className="stop-checkboxes">
                <label>
                  <input
                    type="checkbox"
                    checked={stop.isBoardingPoint}
                    onChange={(e) => {
                      const newStops = [...stops];
                      newStops[index].isBoardingPoint = e.target.checked;
                      setStops(newStops);
                    }}
                  />
                  Boarding Point
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={stop.isTopStation}
                    onChange={(e) => {
                      const newStops = [...stops];
                      newStops[index].isTopStation = e.target.checked;
                      setStops(newStops);
                    }}
                  />
                  Top Station
                </label>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setStops([...stops, { ...newStop }])}>
            Add Stop
          </button>

          <button type="submit" className="submit-button">
            {editingRoute ? 'Update Route' : 'Create Route'}
          </button>
        </form>

        <div className="routes-list">
          <h3>Existing Routes</h3>
          <table>
            <thead>
              <tr>
                <th>Route Name</th>
                <th>Start Location</th>
                <th>End Location</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Distance</th>
                <th>Status</th>
                <th>Stops</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map(route => (
                <tr key={route._id}>
                  <td>{route.routeName}</td>
                  <td>{route.startLocation.name}</td>
                  <td>{route.endLocation.name}</td>
                  <td>{route.startTime}</td>
                  <td>{route.endTime}</td>
                  <td>{route.distance} km</td>
                  <td>{route.status}</td>
                  <td>
                    {route.stops && route.stops.length > 0 ? (
                      <div className="stops-cell">
                        {route.stops.map((stop, index) => (
                          <div key={index} className="stop-item">
                            {stop.stop} ({stop.arrival})
                          </div>
                        ))}
                      </div>
                    ) : (
                      'No stops'
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
    </div>
  );
};

export default RouteManagement;
