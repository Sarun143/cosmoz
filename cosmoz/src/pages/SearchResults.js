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
  const [stops, setStops] = useState([]);

  useEffect(() => {
    const storedStops = localStorage.getItem('allStops');
    if (storedStops) {
      setStops(JSON.parse(storedStops));
    }
  }, []);

  useEffect(() => {
    if (departureStop && arrivalStop && departureDate) {
      const fetchResults = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/search/search-bus', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ departureStop, arrivalStop, departureDate, returnDate }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }

          const data = await response.json();
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
    }
  }, [departureStop, arrivalStop, departureDate, returnDate]);

  return (
    <div className="search-results">
      <Navbar />
      <h1>Search Results</h1>
      {error && <p className="error">{error}</p>}
      <div className="results-container">
        {results.length > 0 && results.map((result) => (
          <div key={result.routeId} className="result-card">
            <h3> {result.name}</h3>
          {/* Route Name: */}
            <p><strong>Departure:</strong> {result.departureStop} at {result.departure}</p>
            <p><strong>Arrival:</strong> {result.arrivalStop} at {result.arrival}</p>
            <p><strong>Total Distance:</strong> {result.totaldistance} km</p>
            <p><strong>Frequency:</strong> {result.frequency}</p>
            <button onClick={() => navigate('/busbooking')} className="book-button">Book</button>
          </div>
        ))}
        
        {results.length > 0 && (
          <div className="result-card">
            <h3> Stops on this route </h3>
            <div className="stops-list">
              {[...new Set(results.flatMap(result => 
                [
                  result.departureStop, 
                  ...(result.stops?.map(stop => stop.stop) || []),
                  result.arrivalStop
                ]
              ))].map((stop, index) => (
                <span key={index} className="stop-item">{stop}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
