const express = require('express');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation
const router = express.Router();
const Bus = require('../model/Bus');

// GET DOCUMENT EXPIRY NOTIFICATIONS
router.get("/notifications", async (req, res) => {
  try {
    // Get current date and future date
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 15); // 15 days in the future
    
    console.log("Searching for documents expiring before:", futureDate);
    
    // Basic query to find all active buses first (to check if route works at all)
    const buses = await Bus.find({ status: "Active" });
    console.log(`Found ${buses.length} active buses`);
    
    if (!buses || buses.length === 0) {
      return res.status(200).json([]); // Return empty array if no buses
    }
    
    // Format the notifications
    const notifications = [];
    
    buses.forEach(bus => {
      // Helper function to check document expiration and add notification
      const checkDocument = (expiryDateField, documentType) => {
        // Skip if no expiry date
        if (!bus[expiryDateField]) return;
        
        try {
          const expiryDate = new Date(bus[expiryDateField]);
          console.log(`${bus.registrationNumber} - ${documentType} expires on:`, expiryDate);
          
          // Check if date is valid
          if (isNaN(expiryDate.getTime())) {
            console.log(`Invalid date for ${bus.registrationNumber} - ${documentType}`);
            return;
          }
          
          // Check if expires within 15 days or already expired
          if (expiryDate <= futureDate) {
            const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
            
            notifications.push({
              busId: bus._id,
              busRegistration: bus.registrationNumber,
              busType: bus.type,
              documentType: documentType,
              expiryDate: expiryDate,
              daysRemaining: daysRemaining,
              isExpired: daysRemaining < 0
            });
            
            console.log(`Added notification for ${bus.registrationNumber} - ${documentType}: ${daysRemaining} days remaining`);
          }
        } catch (error) {
          console.error(`Error processing ${documentType} date for ${bus.registrationNumber}:`, error);
        }
      };
      
      // Check each document type
      checkDocument('taxExpiryDate', 'Road Tax');
      checkDocument('insuranceExpiryDate', 'Insurance');
      checkDocument('pollutionExpiryDate', 'Pollution Certificate');
    });
    
    // Sort by days remaining (most urgent first)
    notifications.sort((a, b) => a.daysRemaining - b.daysRemaining);
    
    console.log(`Returning ${notifications.length} notifications`);
    return res.status(200).json(notifications);
    
  } catch (error) {
    console.error("Error in notifications route:", error);
    return res.status(500).json({ 
      message: "Failed to fetch notifications", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;