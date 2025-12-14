const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const authenticate = require('../middleware/auth');

// Follow user
router.post('/:id/follow', authenticate, async (req, res) => {
    try {
        await pool.query(
            'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [req.userId, req.params.id]
        );
        res.json({ message: 'User followed' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Unfollow user
router.delete('/:id/follow', authenticate, async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
            [req.userId, req.params.id]
        );
        res.json({ message: 'User unfollowed' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get user profile
router.get('/:id', authenticate, async (req, res) => {
    try {
        const user = await pool.query(`
            SELECT u.*,
            (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count,
            (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as followers_count,
            (SELECT COUNT(*) FROM posts WHERE user_id = u.id) as posts_count
            FROM users u WHERE u.id = $1
        `, [req.params.id]);
        
        const posts = await pool.query(
            'SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC',
            [req.params.id]
        );
        
        res.json({
            user: user.rows[0],
            posts: posts.rows
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;