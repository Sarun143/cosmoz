import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const { departureStop, arrivalStop, departureDate, returnDate } = location.state || {};
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (departureStop && arrivalStop && departureDate) {
      const fetchResults = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/search/search-bus', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              departureStop, 
              arrivalStop, 
              departureDate: departureDate instanceof Date ? departureDate.toISOString() : departureDate,
              returnDate: returnDate instanceof Date ? returnDate.toISOString() : returnDate
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }

          const data = await response.json();
          console.log('Search results:', data);
          setResults(data);
          if (data.length === 0) {
            setError('No routes found for the given criteria.');
          }
        } catch (err) {
          console.error('Search error:', err);
          setError('An error occurred while searching. Please try again.');
        }
      };

      fetchResults();
    } else {
      setError('Please provide departure, arrival, and date information.');
    }
  }, [departureStop, arrivalStop, departureDate, returnDate]);

  // Function to format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  // Generate example stops times (since we don't have this data in the original results)
  const generateStopTimes = (result) => {
    if (!result || !result.departure || !result.arrival) return {};
    
    const departureTime = result.departure;
    const arrivalTime = result.arrival;
    
    const stopsWithTimes = {};
    
    // Set departure stop time
    stopsWithTimes[result.departureStop] = departureTime;
    
    // Set arrival stop time
    stopsWithTimes[result.arrivalStop] = arrivalTime;
    
    // Calculate approximate times for intermediate stops
    const allStops = [
      result.departureStop,
      ...(result.stops?.map(s => typeof s === 'string' ? s : s.stop) || []),
      result.arrivalStop
    ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
    
    // Simple even distribution of time for stops (this is just a placeholder logic)
    if (allStops.length > 2) {
      const [departureHours, departureMinutes] = departureTime.split(':').map(Number);
      const [arrivalHours, arrivalMinutes] = arrivalTime.split(':').map(Number);
      
      let departureTimeMinutes = departureHours * 60 + departureMinutes;
      let arrivalTimeMinutes = arrivalHours * 60 + arrivalMinutes;
      
      // Handle overnight journeys
      if (arrivalTimeMinutes < departureTimeMinutes) {
        arrivalTimeMinutes += 24 * 60; // Add 24 hours
      }
      
      const totalMinutes = arrivalTimeMinutes - departureTimeMinutes;
      const minutesPerStop = totalMinutes / (allStops.length - 1);
      
      // Calculate time for each intermediate stop
      for (let i = 1; i < allStops.length - 1; i++) {
        const stopTimeMinutes = departureTimeMinutes + (minutesPerStop * i);
        const stopHours = Math.floor(stopTimeMinutes / 60) % 24;
        const stopMinutes = Math.floor(stopTimeMinutes % 60);
        stopsWithTimes[allStops[i]] = `${stopHours.toString().padStart(2, '0')}:${stopMinutes.toString().padStart(2, '0')}`;
      }
    }
    
    return stopsWithTimes;
  };

  return (
    <div className="search-results-page">
      <Navbar />
      <div className="container">
        <h1 className="search-title">Search Results</h1>
        
        {error && <p className="error-message">{error}</p>}
        
        <div className="results-list">
          {results.length > 0 && results.map((result) => {
            const stopTimes = generateStopTimes(result);
            
            return (
              <div key={result._id || result.routeId} className="result-card">
                <div className="route-name-section">
                  <h2 className="route-name">{result.departureStop} - {result.arrivalStop}</h2>
                </div>
                
                <div className="route-details-row">
                  <div className="detail-item">
                    <span className="detail-label">Departure:</span>
                    <span className="detail-value">{result.departureStop} at {formatTime(result.departure)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Arrival:</span>
                    <span className="detail-value">{result.arrivalStop} at {formatTime(result.arrival)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Total Distance:</span>
                    <span className="detail-value">{result.totaldistance || result.totalDistance || '0'} km</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Frequency:</span>
                    <span className="detail-value">{result.frequency || 'all_day'}</span>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/BookingPage', { 
                      state: { selectedRoute: result } 
                    })} 
                    className="book-button"
                  >
                    Book
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {results.length > 0 && (
          <div className="stops-section">
            <h2 className="stops-title">Stops on this route</h2>
            <div className="stops-container">
              {/* Get all unique stops with their arrival times */}
              {(() => {
                if (!results[0]) return null;
                
                // Get all stops including departure and arrival
                const result = results[0];
                const allStops = [
                  result.departureStop,
                  ...(result.stops?.map(s => typeof s === 'string' ? s : s.stop) || []),
                  result.arrivalStop
                ].filter((value, index, self) => self.indexOf(value) === index);
                
                // Generate stop times
                const stopTimes = generateStopTimes(result);
                
                // Return stop chips with times
                return allStops.map((stop, index) => (
                  <span key={index} className="stop-chip">
                    {stop} {stopTimes[stop] ? `at ${stopTimes[stop]}` : ''}
                  </span>
                ));
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;