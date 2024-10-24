import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaBus, FaMapMarkerAlt, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBus = () => {
  // State variables
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.get('http://localhost:5000/api/search-bus', {
        params: {
          fromCity,
          toCity,
          date: departureDate.toISOString() // Convert the date to ISO format for query
        }
      });

      if (response.data.length > 0) {
        setSearchResults(response.data);
        setError(''); // Clear any previous errors
      } else {
        setSearchResults([]);
        setError('No buses found for the selected route and date');
      }
    } catch (error) {
      console.error('Error fetching bus routes:', error);
      setError('An error occurred while fetching bus routes.');
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <FaBus className="icon" />
          <label htmlFor="fromCity"></label>
          <select id="fromCity" value={fromCity} onChange={(e) => setFromCity(e.target.value)}>
            <option value="" disabled>Select From City</option>
            <option value="Banglore">Banglore</option>
            <option value="Kottayam">Kottayam</option>
            <option value="Erumeli">Erumeli</option>
            <option value="Pala">Pala</option>
            <option value="Thodupuzha">Thodupuzha</option>
          </select>
        </div>

        <div className="form-group">
          <FaMapMarkerAlt className="icon" />
          <label htmlFor="toCity"></label>
          <select id="toCity" value={toCity} onChange={(e) => setToCity(e.target.value)}>
            <option value="" disabled>Select To City</option>
            <option value="Banglore">Banglore</option>
            <option value="Kottayam">Kottayam</option>
            <option value="Erumeli">Erumeli</option>
            <option value="Pala">Pala</option>
            <option value="Thodupuzha">Thodupuzha</option>
          </select>
        </div>

        <div className="form-group">
          <FaCalendarAlt className="icon" />
          <label htmlFor="departureDate"></label>
          <DatePicker
            selected={departureDate}
            onChange={(date) => setDepartureDate(date)}
            dateFormat="EEE, dd MMM"
            minDate={new Date()}
          />
        </div>

        <div className="form-group">
          <FaCalendarAlt className="icon" />
          <label htmlFor="returnDate"></label>
          <DatePicker
            selected={returnDate}
            onChange={(date) => setReturnDate(date)}
            dateFormat="EEE, dd MMM"
            minDate={departureDate}
            placeholderText="Return Date"
          />
        </div>

        <button type="submit" className="search-btn">
          <FaSearch /> Search
        </button>
      </form>

      {/* Display Search Results */}
      <div className="search-results">
        {error && <p className="error-message">{error}</p>}
        {searchResults.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Route ID</th>
                <th>Route Name</th>
                <th>Departure Stop</th>
                <th>Arrival Stop</th>
                <th>Departure Time</th>
                <th>Arrival Time</th>
                <th>Stops</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((route) => (
                <tr key={route.routeId}>
                  <td>{route.routeId}</td>
                  <td>{route.name}</td>
                  <td>{route.departureStop}</td>
                  <td>{route.arrivalStop}</td>
                  <td>{route.departure}</td>
                  <td>{route.arrival}</td>
                  <td>
                    {route.stops.map((stop, index) => (
                      <div key={index}>
                        {stop.stop} - {stop.arrival}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SearchBus;
