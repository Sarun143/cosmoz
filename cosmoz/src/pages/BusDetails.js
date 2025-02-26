// BusDetailsPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Updated import
import "./BusDetails.css"; // Optional styling file
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const BusDetailsPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/buses/viewvehicle");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error.response?.data || error.message);
    }
  };

  const handleAddVehicle = () => {
    // Redirect to the OCR page for adding bus details using navigate
    navigate("/add-bus"); // Replaces history.push("/add-bus")
  };

  return (
    <div className="bus-details-page">
     <Header />
    <Sidebar /> 
      <div className="bus-details-container">
        <h2>BUS DETAILS</h2>
        <div className="button-container">
          <button onClick={handleAddVehicle}>Add Bus Details</button>
        </div>
        <table className="bus-table">
          <thead>
            <tr>
              <th>Reg. No.</th>
              <th>Bus Type</th>
              <th>Lower Deck</th>
              <th>Upper Deck</th>
              <th>Total Seats</th>
              <th>Tax Exp.</th>
              <th>Insurance Exp.</th>
              <th>Pollution Exp.</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle._id}>
                <td>{vehicle.registrationNumber}</td>
                <td>{vehicle.type}</td>
                <td>{vehicle.seats.Lower}</td>
                <td>{vehicle.seats.Upper}</td>
                <td>{vehicle.seats.totalSeats}</td>
                <td>{vehicle.taxExpiryDate ? new Date(vehicle.taxExpiryDate).toLocaleDateString() : "N/A"}</td>
                <td>{vehicle.insuranceExpiryDate ? new Date(vehicle.insuranceExpiryDate).toLocaleDateString() : "N/A"}</td>
                <td>{vehicle.pollutionExpiryDate ? new Date(vehicle.pollutionExpiryDate).toLocaleDateString() : "N/A"}</td>
                <td>{vehicle.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusDetailsPage;
