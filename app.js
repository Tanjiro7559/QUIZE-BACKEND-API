const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Database connection
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
