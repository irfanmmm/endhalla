const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('../config/db');
require('dotenv').config();

const adminRoutes = require('./routes');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, '../../public')));

connectDB();

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Admin API Service is running',
    port: process.env.ADMIN_PORT || 5003,
  });
});

app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.ADMIN_PORT || 5003;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🛡️  Admin API Server running on http://0.0.0.0:${PORT}`);
});
