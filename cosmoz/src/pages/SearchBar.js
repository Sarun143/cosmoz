import React, { useState, useEffect } from 'react';
import { FaBus, FaMapMarkerAlt, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

import './SearchBar.css';

const SearchBus = () => {
  const [departureStop, setDepartureStop] = useState('');
  const [arrivalStop, setArrivalStop] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(null);
  const [error, setError] = useState('');
  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [arrivalSuggestions, setArrivalSuggestions] = useState([]);

  const navigate = useNavigate();

  const fetchSuggestions = async (query, setSuggestions) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/search/stop-suggestions?query=${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  useEffect(() => {
    fetchSuggestions(departureStop, setDepartureSuggestions);
  }, [departureStop]);

  useEffect(() => {
    fetchSuggestions(arrivalStop, setArrivalSuggestions);
  }, [arrivalStop]);

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');

    // Navigate to SearchResults with search criteria as state
    navigate('/searchresults', {
      state: {
        departureStop,
        arrivalStop,
        departureDate,
        returnDate,
      },
    });
  };

  return (
    <div className="sear">
      <form onSubmit={handleSearch}>
        <div>
          <FaBus className="icon" />
          <input
            type="text"
            id="departureStop"
            value={departureStop}
            onChange={(e) => setDepartureStop(e.target.value)}
            placeholder="Departure Stop"
            required
          />
          {departureSuggestions.length > 0 && (
            <ul className="suggestions">
              {departureSuggestions.map((suggestion, index) => (
                <li key={index} onClick={() => setDepartureStop(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <FaMapMarkerAlt className="icon" />
          <input
            type="text"
            id="arrivalStop"
            value={arrivalStop}
            onChange={(e) => setArrivalStop(e.target.value)}
            placeholder="Arrival Stop"
            required
          />
          {arrivalSuggestions.length > 0 && (
            <ul className="suggestions">
              {arrivalSuggestions.map((suggestion, index) => (
                <li key={index} onClick={() => setArrivalStop(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <FaCalendarAlt className="icon" />
          <DatePicker
            selected={departureDate}
            onChange={(date) => setDepartureDate(date)}
            dateFormat="EEE, dd MMM"
            minDate={new Date()}
          />
        </div>
        <div>
          <FaCalendarAlt className="icon" />
          <DatePicker
            selected={returnDate}
            onChange={(date) => setReturnDate(date)}
            dateFormat="EEE, dd MMM"
            minDate={departureDate}
            placeholderText="Return Date (Optional)"
          />
        </div>
        
        <button type="submit">
          <FaSearch /> Search
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SearchBus;
