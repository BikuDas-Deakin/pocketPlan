const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// PostgreSQL Connection Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully');
    }
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// ============================================
// AUTH ROUTES
// ============================================

// Register new user
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user exists
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await pool.query(
            'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
            [email, hashedPassword, name]
        );

        const user = result.rows[0];

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Find user
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// ============================================
// EXPENSE ROUTES
// ============================================

// Get all expenses for user
app.get('/api/expenses', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
            [req.user.userId]
        );
        res.json({ expenses: result.rows });
    } catch (error) {
        console.error('Get expenses error:', error);
        res.status(500).json({ error: 'Error fetching expenses' });
    }
});

// Get expenses by date range
app.get('/api/expenses/range', authenticateToken, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const result = await pool.query(
            'SELECT * FROM expenses WHERE user_id = $1 AND date BETWEEN $2 AND $3 ORDER BY date DESC',
            [req.user.userId, startDate, endDate]
        );
        res.json({ expenses: result.rows });
    } catch (error) {
        console.error('Get expenses by range error:', error);
        res.status(500).json({ error: 'Error fetching expenses' });
    }
});

// Create new expense
app.post('/api/expenses', authenticateToken, async (req, res) => {
    try {
        const { amount, category, description, date, payment_method } = req.body;

        if (!amount || !category) {
            return res.status(400).json({ error: 'Amount and category are required' });
        }

        const result = await pool.query(
            `INSERT INTO expenses (user_id, amount, category, description, date, payment_method) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [req.user.userId, amount, category, description, date || new Date(), payment_method || 'cash']
        );

        res.status(201).json({
            message: 'Expense created successfully',
            expense: result.rows[0]
        });
    } catch (error) {
        console.error('Create expense error:', error);
        res.status(500).json({ error: 'Error creating expense' });
    }
});

// Update expense
app.put('/api/expenses/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, category, description, date, payment_method } = req.body;

        const result = await pool.query(
            `UPDATE expenses 
             SET amount = $1, category = $2, description = $3, date = $4, payment_method = $5 
             WHERE id = $6 AND user_id = $7 
             RETURNING *`,
            [amount, category, description, date, payment_method, id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({
            message: 'Expense updated successfully',
            expense: result.rows[0]
        });
    } catch (error) {
        console.error('Update expense error:', error);
        res.status(500).json({ error: 'Error updating expense' });
    }
});

// Delete expense
app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Delete expense error:', error);
        res.status(500).json({ error: 'Error deleting expense' });
    }
});

// Get expense statistics
app.get('/api/expenses/stats/summary', authenticateToken, async (req, res) => {
    try {
        const { month, year } = req.query;
        const currentMonth = month || new Date().getMonth() + 1;
        const currentYear = year || new Date().getFullYear();

        const result = await pool.query(
            `SELECT 
                category,
                SUM(amount) as total,
                COUNT(*) as count
             FROM expenses 
             WHERE user_id = $1 
             AND EXTRACT(MONTH FROM date) = $2 
             AND EXTRACT(YEAR FROM date) = $3
             GROUP BY category`,
            [req.user.userId, currentMonth, currentYear]
        );

        res.json({ statistics: result.rows });
    } catch (error) {
        console.error('Get statistics error:', error);
        res.status(500).json({ error: 'Error fetching statistics' });
    }
});

// ============================================
// BUDGET ROUTES
// ============================================

// Get user budgets
app.get('/api/budgets', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM budgets WHERE user_id = $1 ORDER BY category',
            [req.user.userId]
        );
        res.json({ budgets: result.rows });
    } catch (error) {
        console.error('Get budgets error:', error);
        res.status(500).json({ error: 'Error fetching budgets' });
    }
});

// Create or update budget
app.post('/api/budgets', authenticateToken, async (req, res) => {
    try {
        const { category, amount, month, year } = req.body;

        if (!category || !amount) {
            return res.status(400).json({ error: 'Category and amount are required' });
        }

        const result = await pool.query(
            `INSERT INTO budgets (user_id, category, amount, month, year) 
             VALUES ($1, $2, $3, $4, $5) 
             ON CONFLICT (user_id, category, month, year) 
             DO UPDATE SET amount = $3 
             RETURNING *`,
            [req.user.userId, category, amount, month || new Date().getMonth() + 1, year || new Date().getFullYear()]
        );

        res.status(201).json({
            message: 'Budget set successfully',
            budget: result.rows[0]
        });
    } catch (error) {
        console.error('Set budget error:', error);
        res.status(500).json({ error: 'Error setting budget' });
    }
});

// ============================================
// COMMUNITY ROUTES
// ============================================

// Get community posts
app.get('/api/community/posts', async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;

        const result = await pool.query(
            `SELECT 
                p.*,
                u.name as author_name,
                (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
                (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comments_count
             FROM posts p
             JOIN users u ON p.user_id = u.id
             ORDER BY p.created_at DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        res.json({ posts: result.rows });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: 'Error fetching posts' });
    }
});

// Create community post
app.post('/api/community/posts', authenticateToken, async (req, res) => {
    try {
        const { content, location } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const result = await pool.query(
            `INSERT INTO posts (user_id, content, location) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [req.user.userId, content, location]
        );

        res.status(201).json({
            message: 'Post created successfully',
            post: result.rows[0]
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Error creating post' });
    }
});

// Like a post
app.post('/api/community/posts/:id/like', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            'INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [id, req.user.userId]
        );

        res.json({ message: 'Post liked successfully' });
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ error: 'Error liking post' });
    }
});

// ============================================
// GOVERNMENT BENEFITS ROUTES
// ============================================

// Get available benefits
app.get('/api/benefits', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM government_benefits WHERE active = true ORDER BY category, name'
        );
        res.json({ benefits: result.rows });
    } catch (error) {
        console.error('Get benefits error:', error);
        res.status(500).json({ error: 'Error fetching benefits' });
    }
});

// Check eligibility (simplified)
app.post('/api/benefits/check-eligibility', authenticateToken, async (req, res) => {
    try {
        const { income, age, location, household_size } = req.body;

        // This is a simplified eligibility check
        // In production, this would involve complex rules engine
        const result = await pool.query(
            `SELECT * FROM government_benefits 
             WHERE active = true 
             AND (income_threshold IS NULL OR income_threshold >= $1)
             AND (age_requirement IS NULL OR age_requirement <= $2)`,
            [income, age]
        );

        res.json({ 
            eligible_benefits: result.rows,
            message: 'Eligibility check completed'
        });
    } catch (error) {
        console.error('Check eligibility error:', error);
        res.status(500).json({ error: 'Error checking eligibility' });
    }
});

// ============================================
// AI INSIGHTS ROUTES (Mock for now)
// ============================================

// Get AI insights
app.get('/api/insights/ai', authenticateToken, async (req, res) => {
    try {
        // In production, this would use TensorFlow/ML models
        // For now, return mock insights based on spending patterns
        
        const expenses = await pool.query(
            `SELECT category, SUM(amount) as total 
             FROM expenses 
             WHERE user_id = $1 
             AND date >= CURRENT_DATE - INTERVAL '30 days'
             GROUP BY category`,
            [req.user.userId]
        );

        const insights = generateMockInsights(expenses.rows);

        res.json({ insights });
    } catch (error) {
        console.error('Get AI insights error:', error);
        res.status(500).json({ error: 'Error generating insights' });
    }
});

// Mock AI insights generator
function generateMockInsights(expenses) {
    const insights = [];

    expenses.forEach(exp => {
        if (exp.category === 'transport' && exp.total > 500) {
            insights.push({
                type: 'warning',
                category: 'transport',
                message: `You've spent $${exp.total} on transport this month. Consider using public transport or carpooling to save.`,
                potential_savings: 50
            });
        }

        if (exp.category === 'food' && exp.total > 600) {
            insights.push({
                type: 'tip',
                category: 'food',
                message: 'Meal planning could reduce your food costs by up to 25%',
                potential_savings: exp.total * 0.25
            });
        }
    });

    // Always add energy saving tip
    insights.push({
        type: 'opportunity',
        category: 'utilities',
        message: 'Switch to a cheaper energy provider and save up to $45/month',
        potential_savings: 45
    });

    return insights;
}

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`PocketPlan server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});