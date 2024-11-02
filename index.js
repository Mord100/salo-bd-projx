require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3001;

// Import routes
const donorRoutes = require('./routes/donorRoutes');
const donationRoutes = require('./routes/donationRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
// const communicationRoutes = require('./routes/communicationRoutes');
const bloodStockRoutes = require('./routes/bloodStockRoutes');
// const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/donors', donorRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/appointments', appointmentRoutes);
// app.use('/api/communications', communicationRoutes);
app.use('/api/blood-stock', bloodStockRoutes);
// app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
