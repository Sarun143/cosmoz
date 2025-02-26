import React, { useState } from "react";
import Tesseract from "tesseract.js";
import axios from "axios";
import "./AddBusPage.css";

const AddBusPage = () => {
  const [formData, setFormData] = useState({
    registrationNumber: "",
    type: "AC",
    Lower: "",
    Upper: "",
    taxExpiryDate: "",
    insuranceExpiryDate: "",
    pollutionExpiryDate: "",
    status: "Active",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files.length === 0) return;

    const file = files[0];

    try {
      const { data } = await Tesseract.recognize(file, "eng");
      console.log("Extracted Text:", data.text);

      const expiryDateMatch = data.text.match(/(\d{2}[\/-]\d{2}[\/-]\d{4})/);
      if (expiryDateMatch) {
        let expiryDate = expiryDateMatch[0];
        let [day, month, year] = expiryDate.split(/[\/-]/);
        expiryDate = `${year}-${month}-${day}`;

        setFormData((prev) => ({
          ...prev,
          [name]: expiryDate,
        }));
      } else {
        alert("Could not detect an expiry date. Please enter it manually.");
        setFormData((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    } catch (error) {
      console.error("OCR Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        Lower: parseInt(formData.Lower) || 0,
        Upper: parseInt(formData.Upper) || 0,
        totalSeats: (parseInt(formData.Lower) || 0) + (parseInt(formData.Upper) || 0),
        taxExpiryDate: formData.taxExpiryDate ? new Date(formData.taxExpiryDate) : null,
        insuranceExpiryDate: formData.insuranceExpiryDate ? new Date(formData.insuranceExpiryDate) : null,
        pollutionExpiryDate: formData.pollutionExpiryDate ? new Date(formData.pollutionExpiryDate) : null,
        status: formData.status,
      };

      await axios.post("http://localhost:5000/api/buses/bus/add", formattedData);
      alert("Bus added successfully!");
    } catch (error) {
      console.error("Error adding bus:", error);
    }
  };

  return (
    <div className="add-vehicle-container">
      <h2>BUS DETAILS</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Registration Number:</label>
          <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Bus Type:</label>
          <select name="type" value={formData.type} onChange={handleInputChange} required>
            <option value="AC">AC</option>
            <option value="Non-AC">Non-AC</option>
            <option value="Sleeper">Sleeper</option>
            <option value="Seater">Seater</option>
          </select>
        </div>
        <div>
          <label>Lower Deck Seats:</label>
          <input type="number" name="Lower" value={formData.Lower} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Upper Deck Seats:</label>
          <input type="number" name="Upper" value={formData.Upper} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Road Tax Document:</label>
          <input type="file" name="taxExpiryDate" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
        </div>
        <div>
          <label>Insurance Document:</label>
          <input type="file" name="insuranceExpiryDate" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
        </div>
        <div>
          <label>Pollution Certificate:</label>
          <input type="file" name="pollutionExpiryDate" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
        </div>
        <div>
          <label>Tax Expiry Date:</label>
          <input type="text" name="taxExpiryDate" value={formData.taxExpiryDate} readOnly />
        </div>
        <div>
          <label>Insurance Expiry Date:</label>
          <input type="text" name="insuranceExpiryDate" value={formData.insuranceExpiryDate} readOnly />
        </div>
        <div>
          <label>Pollution Expiry Date:</label>
          <input type="text" name="pollutionExpiryDate" value={formData.pollutionExpiryDate} readOnly />
        </div>
        <div>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleInputChange} required>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Deleted">Deleted</option>
          </select>
        </div>
        <button type="submit">Add Bus</button>
      </form>
    </div>
  );
};

export default AddBusPage;
