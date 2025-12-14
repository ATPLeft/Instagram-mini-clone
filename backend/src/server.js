require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/instagram_clone'
});

// Middleware to verify token
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// === AUTHENTICATION ===
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, email, password, full_name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(
            `INSERT INTO users (username, email, password, full_name) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, username, email, full_name`,
            [username, email, hashedPassword, full_name]
        );
        
        const token = jwt.sign(
            { userId: result.rows[0].id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );
        
        res.json({ token, user: result.rows[0] });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );
        
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                profile_pic: user.profile_pic
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// === POSTS ===
app.post('/api/posts', authenticate, async (req, res) => {
    try {
        const { image_url, caption } = req.body;
        const result = await pool.query(
            `INSERT INTO posts (user_id, image_url, caption) 
             VALUES ($1, $2, $3) 
             RETURNING *, 
             (SELECT username FROM users WHERE id = $1) as username`,
            [req.userId, image_url, caption]
        );
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

app.get('/api/posts/feed', authenticate, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, u.username, u.profile_pic,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count,
            EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $1) as liked_by_user
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id IN (
                SELECT following_id FROM follows WHERE follower_id = $1
            ) OR p.user_id = $1
            ORDER BY p.created_at DESC
        `, [req.userId]);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Feed error:', error);
        res.status(500).json({ error: 'Failed to fetch feed' });
    }
});

app.get('/api/posts/:id/comments', authenticate, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*, u.username, u.profile_pic
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = $1
            ORDER BY c.created_at ASC
        `, [req.params.id]);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Comments error:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// === LIKES ===
app.post('/api/posts/:id/like', authenticate, async (req, res) => {
    try {
        await pool.query(
            'INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [req.userId, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Like error:', error);
        res.status(500).json({ error: 'Failed to like post' });
    }
});

app.delete('/api/posts/:id/like', authenticate, async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
            [req.userId, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Unlike error:', error);
        res.status(500).json({ error: 'Failed to unlike post' });
    }
});

// === COMMENTS ===
app.post('/api/posts/:id/comments', authenticate, async (req, res) => {
    try {
        const { content } = req.body;
        const result = await pool.query(`
            INSERT INTO comments (user_id, post_id, content) 
            VALUES ($1, $2, $3) 
            RETURNING *, 
            (SELECT username FROM users WHERE id = $1) as username
        `, [req.userId, req.params.id, content]);
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Comment error:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// === PROFILE ===
app.get('/api/users/profile', authenticate, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.*,
            (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count,
            (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as followers_count,
            (SELECT COUNT(*) FROM posts WHERE user_id = u.id) as posts_count
            FROM users u WHERE u.id = $1
        `, [req.userId]);
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

app.get('/api/users/:id', authenticate, async (req, res) => {
    try {
        const userResult = await pool.query(`
            SELECT u.*,
            (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count,
            (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as followers_count,
            (SELECT COUNT(*) FROM posts WHERE user_id = u.id) as posts_count,
            EXISTS(SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = u.id) as is_following
            FROM users u WHERE u.id = $2
        `, [req.userId, req.params.id]);
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const postsResult = await pool.query(`
            SELECT p.*,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
            FROM posts p WHERE p.user_id = $1
            ORDER BY p.created_at DESC
        `, [req.params.id]);
        
        res.json({
            user: userResult.rows[0],
            posts: postsResult.rows
        });
    } catch (error) {
        console.error('User profile error:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// === FOLLOW SYSTEM ===
app.post('/api/users/:id/follow', authenticate, async (req, res) => {
    try {
        await pool.query(
            'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [req.userId, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Follow error:', error);
        res.status(500).json({ error: 'Failed to follow user' });
    }
});

app.delete('/api/users/:id/follow', authenticate, async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
            [req.userId, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Unfollow error:', error);
        res.status(500).json({ error: 'Failed to unfollow user' });
    }
});

// === USER'S POSTS ===
app.get('/api/users/:id/posts', authenticate, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
            FROM posts p WHERE p.user_id = $1
            ORDER BY p.created_at DESC
        `, [req.params.id]);
        
        res.json(result.rows);
    } catch (error) {
        console.error('User posts error:', error);
        res.status(500).json({ error: 'Failed to fetch user posts' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Instagram Clone Backend running on port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
});