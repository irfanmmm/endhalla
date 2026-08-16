const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Counsellor API is running', port: process.env.COUNSELLOR_PORT || 5001 });
});

// Start Server
const PORT = process.env.COUNSELLOR_PORT || 5001;
app.listen(PORT, () => {
  console.log(`Counsellor API Server running on port ${PORT}`);
});
