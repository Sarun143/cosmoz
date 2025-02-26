const express = require("express");
const router = express.Router();
const multer = require("multer");
const Tesseract = require("tesseract.js");
const Bus = require("../model/Bus");

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
router.get("/viewvehicle", async (req, res) => {
  try {
    const vehicles = await Bus.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//////////////////////////////// - NEW UPDATES - ////////////////////////////////

// ADD NEW BUS
router.post("/bus/add", async (req, res) => {
  try {
    const { registrationNumber, type, totalSeats, Lower, Upper, taxExpiryDate, insuranceExpiryDate, pollutionExpiryDate } = req.body; //driver, , route

    if (!registrationNumber || !type || !totalSeats  ) { // || !driver || !route
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const existingBus = await Bus.findOne({ registrationNumber });
    if (existingBus) {
      return res.status(400).json({ message: "Bus with this registration number already exists" });
    }

    const parsedLower = parseInt(Lower) || 0;
    const parsedUpper = parseInt(Upper) || 0;
    if (parsedLower + parsedUpper !== totalSeats) {
      return res.status(400).json({ message: "Lower + Upper seats must equal totalSeats" });
    }

    const newBus = new Bus({
      registrationNumber,
      type,
      seats: {
        totalSeats,
        Lower: parsedLower,
        Upper: parsedUpper,
      },
      // driver,
      // route,
      taxExpiryDate: taxExpiryDate ? new Date(taxExpiryDate) : null,
      insuranceExpiryDate: insuranceExpiryDate ? new Date(insuranceExpiryDate) : null,
      pollutionExpiryDate: pollutionExpiryDate ? new Date(pollutionExpiryDate) : null,
      // taxDocument,
      // insuranceDocument,
      // pollutionDocument,
    });

    await newBus.save();
    res.status(201).json({ message: "Bus added successfully", data: newBus });

  } catch (error) {
    console.log("Error adding bus:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
});

// GET ALL BUS
router.get("/all/buses", async (req, res) => {
  try {
    const buses = await Bus.find({status:"Active"})//.populate("driver route");
    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch buses", error: error.message });
  }
});

// GET A BUS
router.get("/get/bus", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "Invalid Bus ID" });
    }

    const bus = await Bus.findById(id)//.populate("driver route");
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    res.status(200).json(bus);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bus details", error: error.message });
  }
});

// UPDATE A BUS
router.put("/update/bus", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Invalid Bus ID" });
    }

    const { registrationNumber, type, totalSeats, Lower, Upper, driver, route, taxExpiryDate, insuranceExpiryDate, pollutionExpiryDate, taxDocument, insuranceDocument, pollutionDocument } = req.body;

    const parsedLower = parseInt(Lower) || 0;
    const parsedUpper = parseInt(Upper) || 0;
    if (parsedLower + parsedUpper !== totalSeats) {
      return res.status(400).json({ message: "Lower + Upper seats must equal totalSeats" });
    }

    const updatedBus = await Bus.findByIdAndUpdate(
      id,
      {
        registrationNumber,
        type,
        seats: {
          totalSeats,
          Lower: parsedLower,
          Upper: parsedUpper,
        },
        driver,
        route,
        taxExpiryDate: taxExpiryDate ? new Date(taxExpiryDate) : null,
        insuranceExpiryDate: insuranceExpiryDate ? new Date(insuranceExpiryDate) : null,
        pollutionExpiryDate: pollutionExpiryDate ? new Date(pollutionExpiryDate) : null,
        taxDocument,
        insuranceDocument,
        pollutionDocument,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBus) return res.status(404).json({ message: "Bus not found" });

    res.status(200).json({ message: "Bus updated successfully", bus: updatedBus });

  } catch (error) {
    res.status(500).json({ message: "Error updating bus", error: error.message });
  }
});

// DELETE A BUS
router.delete("/delete/bus", async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Bus ID" });
    }

    const deletedBus = await Bus.findByIdAndDelete(id);
    if (!deletedBus) return res.status(404).json({ message: "Bus not found" });

    res.status(200).json({ message: "Bus deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting bus", error: error.message });
  }
});




module.exports = router;