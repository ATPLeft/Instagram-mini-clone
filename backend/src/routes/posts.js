const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const authenticate = require('../middleware/auth');

// Create post
router.post('/', authenticate, async (req, res) => {
    try {
        const { image_url, caption } = req.body;
        const result = await pool.query(
            'INSERT INTO posts (user_id, image_url, caption) VALUES ($1, $2, $3) RETURNING *',
            [req.userId, image_url, caption]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get feed
router.get('/feed', authenticate, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, u.username, u.profile_pic,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id IN (
                SELECT following_id FROM follows WHERE follower_id = $1
            ) OR p.user_id = $1
            ORDER BY p.created_at DESC
        `, [req.userId]);
        
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Like post
router.post('/:id/like', authenticate, async (req, res) => {
    try {
        await pool.query(
            'INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [req.userId, req.params.id]
        );
        res.json({ message: 'Post liked' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Unlike post
router.delete('/:id/like', authenticate, async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
            [req.userId, req.params.id]
        );
        res.json({ message: 'Post unliked' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Comment on post
router.post('/:id/comments', authenticate, async (req, res) => {
    try {
        const { content } = req.body;
        const result = await pool.query(
            'INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *',
            [req.userId, req.params.id, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;