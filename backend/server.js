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
// const Promotion = require('./model/Promotion');

// const loginRoute = require('./router/');

// Initialize express and dotenv
const app = express();
dotenv.config();

// Middleware
app.use(express.json());  // To parse incoming JSON requests
// app.use(cors());          // To allow requests from your React frontend
// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors({ origin: 'https://cosmoz-b302.onrender.com' }));


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
app.use('/api/staff', leaveRoutes);

// Routes
app.use('/api/bookings', bookingRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


