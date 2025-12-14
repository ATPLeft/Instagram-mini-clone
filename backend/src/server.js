require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/instagram_clone'
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));