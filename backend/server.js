const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const sign = require('./router/sign'); // Assuming sign.js handles authentication

// Initialize express and dotenv
const app = express();
dotenv.config();

// Middleware
app.use(express.json());  // To parse incoming JSON requests
app.use(cors());          // To allow requests from your React frontend

// MongoDB connection using mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log("MongoDB connection error:", error));

// Use authentication routes
app.use('/api/auth',sign); // Mount auth routes under /api/auth

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
