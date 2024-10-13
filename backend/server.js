const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');



//router

const sign=require('./router/sign'); // Assuming sign.js handles authentication
const fetchUser = require('./router/fetch');
const login  = require('./router/login');

const staffRouter = require('./router/Staff'); // Adjust the path to your Staff router

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
app.use('/api', fetchUser);
app.use('/api/auth',login);
// Use staff routes
app.use('/api', staffRouter); // Mount staff routes under /api

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// // Add this route in your backend server.js file

// app.get('/api/routes', async (req, res) => {
// try {
//     const routes = await Route.find(); // Fetch all routes from MongoDB
//     res.json(routes); // Send routes back as JSON
// } catch (err) {
//     res.status(500).json({ error: 'Error fetching routes' });
// }
// });
  