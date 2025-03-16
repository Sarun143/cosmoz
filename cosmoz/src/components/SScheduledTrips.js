import React, { useEffect, useState } from 'react';
import './SScheduledTrips.css';
import SHeader from './SHeader';
import SSidebar from './SSidebar';
import axios from 'axios';

const StaffScheduledTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);

  useEffect(() => {
    // Get the authentication token from localStorage
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email'); // Try different key names
    const userEmail = localStorage.getItem('userEmail');
    const user = localStorage.getItem('user');
    
    // Try to parse user object if it exists
    let parsedUser = null;
    if (user) {
      try {
        parsedUser = JSON.parse(user);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
    
    // Determine the staff email from available sources
    const staffEmail = email || userEmail || (parsedUser && parsedUser.email);
    
    console.log('Auth data:', { token, staffEmail, parsedUser });
    
    if (!staffEmail && !token) {
      setError('You are not logged in. Please log in to view your scheduled trips.');
      setLoading(false);
      return;
    }

    // Fetch all routes first, then filter by staff ID
    const fetchAllTrips = async () => {
      try {
        // Set up headers with auth token if available
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Fetch all routes
        const routesResponse = await axios.get('http://localhost:5000/api/routes', { headers });
        console.log('Routes data:', routesResponse.data);
        
        // If we have a staff email, try to get their profile
        if (staffEmail) {
          try {
            const staffResponse = await axios.get(`http://localhost:5000/api/vstaff/profile-by-email/${staffEmail}`, { headers });
            setStaffInfo(staffResponse.data);
            console.log('Staff info:', staffResponse.data);
            
            // Filter routes where this staff is assigned
            const staffId = staffResponse.data._id;
            const staffRoutes = routesResponse.data.filter(route => 
              route.staffs && route.staffs.includes(staffId)
            );
            
            // Transform routes to trip format
            const formattedTrips = staffRoutes.map(route => {
              const today = new Date();
              const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              const todayDay = daysOfWeek[today.getDay()];
              const dateStr = today.toISOString().split('T')[0];
              
              return {
                date: dateStr,
                route: route.name,
                departureTime: route.departure,
                arrivalTime: route.arrival,
                departureStop: route.departureStop,
                arrivalStop: route.arrivalStop,
                isToday: route.selectedDays && route.selectedDays.includes(todayDay),
                status: route.status,
                stops: route.stops || []
              };
            });
            
            setTrips(formattedTrips);
          } catch (err) {
            console.error('Error fetching staff profile:', err);
            // If we can't get the staff profile, just show all routes as a fallback
            processAllRoutes(routesResponse.data);
          }
        } else {
          // If no staff email, process all routes
          processAllRoutes(routesResponse.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError('Failed to fetch scheduled trips. Please try again later.');
        setLoading(false);
      }
    };
    
    // Process all routes if we can't filter by staff
    const processAllRoutes = (routes) => {
      const today = new Date();
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const todayDay = daysOfWeek[today.getDay()];
      const dateStr = today.toISOString().split('T')[0];
      
      const formattedTrips = routes.map(route => ({
        date: dateStr,
        route: route.name,
        departureTime: route.departure,
        arrivalTime: route.arrival,
        departureStop: route.departureStop,
        arrivalStop: route.arrivalStop,
        isToday: route.selectedDays && route.selectedDays.includes(todayDay),
        status: route.status,
        stops: route.stops || []
      }));
      
      setTrips(formattedTrips);
    };

    fetchAllTrips();
  }, []);

  if (loading) {
    return (
      <div>
        <SHeader/>
        <SSidebar/>
        <div className="loading-container">
          <p>Loading your scheduled trips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <SHeader/>
        <SSidebar/>
        <div className="error-container">
          <p>{error}</p>
          <p>If you are logged in and still seeing this message, please contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-trips-container">
      <SHeader/>
      <SSidebar/>
      <div className="staff-trips-content">
        <h2>My Scheduled Trips</h2>
        
        {staffInfo && (
          <div className="staff-info">
            <p><strong>Staff ID:</strong> {staffInfo.staffId}</p>
            <p><strong>Name:</strong> {staffInfo.name}</p>
            <p><strong>Role:</strong> {staffInfo.role}</p>
          </div>
        )}

        {trips.length === 0 ? (
          <p>You don't have any scheduled trips at the moment.</p>
        ) : (
          <div className="trips-table-container">
            <table className="trips-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Route</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Status</th>
                  <th>Stops</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip, index) => (
                  <tr key={index} className={trip.isToday ? 'today-trip' : ''}>
                    <td>{trip.date}</td>
                    <td>{trip.route}</td>
                    <td>{trip.departureStop}</td>
                    <td>{trip.arrivalStop}</td>
                    <td>{trip.departureTime}</td>
                    <td>{trip.arrivalTime}</td>
                    <td>{trip.status}</td>
                    <td>
                      {trip.stops && trip.stops.length > 0 ? (
                        <button 
                          className="view-stops-btn"
                          onClick={() => {
                            alert(`Stops for ${trip.route}:\n${trip.stops.map(stop => 
                              `${stop.stop} - Arrival: ${stop.arrival}`).join('\n')}`);
                          }}
                        >
                          View Stops
                        </button>
                      ) : (
                        "No stops"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffScheduledTrips;
