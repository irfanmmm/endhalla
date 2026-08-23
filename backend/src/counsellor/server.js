const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));
app.use(express.json());

// Connect to Database
connectDB();

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Counsellor API Service is running',
    port: process.env.COUNSELLOR_PORT || 5001,
  });
});

// API Routes
app.use('/api/counsellor/auth', authRoutes);
app.use('/api/counsellor/dashboard', dashboardRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start Server
const PORT = process.env.COUNSELLOR_PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Counsellor API Server running on http://0.0.0.0:${PORT}`);
});
