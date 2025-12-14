const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, full_name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(
            'INSERT INTO users (username, email, password, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email',
            [username, email, hashedPassword, full_name]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { userId: user.rows[0].id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );
        
        res.json({ 
            token, 
            user: {
                id: user.rows[0].id,
                username: user.rows[0].username,
                email: user.rows[0].email,
                full_name: user.rows[0].full_name
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;