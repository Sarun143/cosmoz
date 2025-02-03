const express = require("express");
const router = express.Router();
const multer = require("multer");
const Tesseract = require("tesseract.js");
const Vehicle = require("../model/Bus");

// Multer Storage Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Add a vehicle
router.post("/add", async (req, res) => {
  try {
    console.log("Received Data:", req.body); // Log request payload

    const { registrationNumber, model, taxExpiryDate, insuranceExpiryDate, pollutionExpiryDate } = req.body;

    // Check for required fields
    if (!registrationNumber || !model) {
      return res.status(400).json({ error: "Registration Number and Model are required" });
    }

    const vehicle = new Vehicle({
      registrationNumber,
      model,
      taxExpiryDate: taxExpiryDate ? new Date(taxExpiryDate) : null,
      insuranceExpiryDate: insuranceExpiryDate ? new Date(insuranceExpiryDate) : null,
      pollutionExpiryDate: pollutionExpiryDate ? new Date(pollutionExpiryDate) : null,
    });

    await vehicle.save();
    res.status(201).json({ message: "Vehicle added successfully", vehicle });

  } catch (error) {
    console.error("Error adding vehicle:", error); // Log error details
    res.status(500).json({ error: error.message });
  }
});


// OCR Extraction
router.post("/extract-text", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { data } = await Tesseract.recognize(req.file.buffer, "eng");
    console.log("Extracted Text:", data.text);

    // Extract expiry date using regex
    const expiryDateMatch = data.text.match(/(\d{2}[\/-]\d{2}[\/-]\d{4})/);
    if (expiryDateMatch) {
      return res.json({ expiryDate: expiryDateMatch[0] });
    } else {
      return res.json({ error: "No expiry date found in document" });
    }
  } catch (error) {
    console.error("OCR Error:", error);
    res.status(500).json({ error: "Error extracting text from document" });
  }
});
// Get all vehicles
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;