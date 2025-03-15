const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); 


//router

const sign=require('./router/sign'); // Assuming sign.js handles authentication
const fetchUser = require('./router/fetch');
const login  = require('./router/login');

const staffRouter = require('./router/Staff'); // Adjust the path to your Staff router
const busRoutes = require('./router/Bus');
const viewstaffRouter = require('./router/vstaff');
const routes = require('./router/Route'); // Assuming routes.js is in the routes folder
const ForgotRoute = require('./router/Forgotpassword');
const BusRoute = require('./router/searchbus')
const promotionRoutes = require('./router/Promotion'); // Import your routes
const leaveRoutes = require('./router/leaveRoutes');
const bookingRoutes = require('./router/bookings');
const feedbackRoutes = require("./router/FeedbackRoutes");
const chatbotRoutes = require('./router/ChatbotRoutes');
const notiRoute = require('./router/Notificationsrouter');


//liveloc
// let busLocation = { latitude: 28.7041, longitude: 77.1025 }; // Default location

// // Endpoint to get bus location
// app.get("/api/bus/location", (req, res) => {
//     res.json(busLocation);
// });

// // Endpoint to update bus location (Simulate GPS update)
// app.post("/api/bus/update-location", (req, res) => {
//     const { latitude, longitude } = req.body;
//     busLocation = { latitude, longitude };
//     res.json({ message: "Bus location updated!" });
// });
const path1 = require('path');
const app1 = express(); // Initialize app first

// Serve static files from the React frontend build folder
app1.use(express.static(path1.join(__dirname, 'build')));

app1.get('*', (req, res) => {
  res.sendFile(path1.join(__dirname, 'build', 'index.html'));
});




// const loginRoute = require('./router/');

// Initialize express and dotenv
const app = express();
dotenv.config();
console.log('JWT_SECRET is set:', !!process.env.JWT_SECRET);

// Middleware
app.use(express.json());  // To parse incoming JSON requests
// app.use(cors());          // To allow requests from your React frontend
app.use(cors({ origin: 'http://localhost:3000' }));
// app.use(cors({ origin: 'https://cosmoz-b302.onrender.com' }));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });

  
// MongoDB connection using mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log("MongoDB connection error:", error));


  // Static folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Use authentication routes
app.use('/api/auth',sign); // Mount auth routes under /api/auth
app.use('/api', fetchUser);
app.use('/api/auth',login);
// Use staff routes
app.use('/api', staffRouter); // Mount staff routes under /api
// frogot password
// const ScholarshipRoute = require('./router/Forgetpassword');
// app.use('/forgetpass', ForgotPasswordRoute);
// Bus routes
app.use('/api/buses', busRoutes);
app.use('/api/vstaff',viewstaffRouter);
// Routes
app.use('/api/routes', routes);
app.use('/forgetpass',ForgotRoute);
app.use('/',BusRoute);
// Use the promotion routes

// Mount the promotion router with the base path
app.use('/api/promotions', promotionRoutes);
app.use('/api/search',BusRoute)
app.use('/api/staff',leaveRoutes);
//feedback
app.use("/api/feedback", feedbackRoutes);

// Routes
app.use('/api/bookings', bookingRoutes);
//chatbot
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/notification', notiRoute);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


