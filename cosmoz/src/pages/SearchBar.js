import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaBus, FaMapMarkerAlt, FaCalendarAlt, FaExchangeAlt, FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = () => {
  // State variables
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(null);

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic here
    console.log({
      fromCity,
      toCity,
      departureDate,
      returnDate
    });
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <FaBus className="icon" />
          <label htmlFor="fromCity"></label>
        {/* Select From City */}
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
        {/* Select From City */}
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
        {/* Departure Date */}
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
        {/* Return Date */}
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
    </div>
  );
};

export default SearchBar;
