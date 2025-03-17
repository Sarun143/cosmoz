const bookingsRouter = require('./router/bookings');

// Mount the bookings router
app.use('/api/bookings', bookingsRouter);

// Check if the bookings router is properly mounted
app.use('/api/bookings', require('./router/bookings')); 