// AddBusPage.js
import React, { useState } from "react";
import Tesseract from "tesseract.js";
import axios from "axios";
import "./AddBusPage.css"; // Optional styling file

const AddBusPage = () => {
  const [formData, setFormData] = useState({
    registrationNumber: "",
    model: "",
    taxExpiryDate: "",
    insuranceExpiryDate: "",
    pollutionExpiryDate: "",
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
        taxExpiryDate: formData.taxExpiryDate ? new Date(formData.taxExpiryDate) : null,
        insuranceExpiryDate: formData.insuranceExpiryDate ? new Date(formData.insuranceExpiryDate) : null,
        pollutionExpiryDate: formData.pollutionExpiryDate ? new Date(formData.pollutionExpiryDate) : null,
      };

      await axios.post("http://localhost:5000/api/buses/add", formattedData);
      alert("Vehicle added successfully!");
    } catch (error) {
      console.error("Error adding vehicle:", error);
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
          <label>Model:</label>
          <input type="text" name="model" value={formData.model} onChange={handleInputChange} required />
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
        <button type="submit">Add Vehicle</button>
      </form>
    </div>
  );
};

export default AddBusPage;
