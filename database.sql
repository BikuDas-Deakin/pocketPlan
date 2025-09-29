-- PocketPlan PostgreSQL Database Schema
-- Version 1.0.0

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- EXPENSES TABLE
-- ============================================
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(20) DEFAULT 'cash',
    receipt_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, date);

-- ============================================
-- BUDGETS TABLE
-- ============================================
CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category, month, year)
);

CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_user_month_year ON budgets(user_id, month, year);

-- ============================================
-- COMMUNITY POSTS TABLE
-- ============================================
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);

-- ============================================
-- POST LIKES TABLE
-- ============================================
CREATE TABLE post_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);

-- ============================================
-- POST COMMENTS TABLE
-- ============================================
CREATE TABLE post_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_post_comments_user_id ON post_comments(user_id);

-- ============================================
-- GOVERNMENT BENEFITS TABLE
-- ============================================
CREATE TABLE government_benefits (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount_min DECIMAL(10, 2),
    amount_max DECIMAL(10, 2),
    income_threshold DECIMAL(10, 2),
    age_requirement INTEGER,
    location_restriction VARCHAR(100),
    application_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_benefits_category ON government_benefits(category);
CREATE INDEX idx_benefits_active ON government_benefits(active);

-- ============================================
-- SAVINGS GOALS TABLE
-- ============================================
CREATE TABLE savings_goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(10, 2) NOT NULL,
    current_amount DECIMAL(10, 2) DEFAULT 0,
    target_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_savings_goals_user_id ON savings_goals(user_id);

-- ============================================
-- AI INSIGHTS TABLE
-- ============================================
CREATE TABLE ai_insights (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    message TEXT NOT NULL,
    potential_savings DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'active',
    dismissed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX idx_ai_insights_status ON ai_insights(status);

-- ============================================
-- USER SETTINGS TABLE
-- ============================================
CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    currency VARCHAR(3) DEFAULT 'AUD',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    theme VARCHAR(20) DEFAULT 'light',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert sample government benefits
INSERT INTO government_benefits (name, category, description, amount_min, amount_max, income_threshold, application_url, active) VALUES
('Victorian Energy Compare', 'energy', 'Energy rebate for Victorian residents to help with electricity and gas bills', 250, 400, NULL, 'https://compare.energy.vic.gov.au/', true),
('Medicare Benefits', 'healthcare', 'Government healthcare subsidy program', NULL, NULL, NULL, 'https://www.servicesaustralia.gov.au/medicare', true),
('Commonwealth Rent Assistance', 'housing', 'Financial assistance to help with rental costs', 50, 200, 45000, 'https://www.servicesaustralia.gov.au/rent-assistance', true),
('Concession Cards', 'transport', 'Discounted public transport for eligible residents', NULL, NULL, NULL, 'https://www.servicesaustralia.gov.au/concession-cards', true),
('Childcare Subsidy', 'childcare', 'Help with childcare costs for working families', NULL, NULL, 120000, 'https://www.servicesaustralia.gov.au/childcare-subsidy', true),
('NDIS Support', 'disability', 'Support for people with disability', NULL, NULL, NULL, 'https://www.ndis.gov.au/', true),
('Age Pension', 'seniors', 'Income support for older Australians', 1000, 2000, 35000, 'https://www.servicesaustralia.gov.au/age-pension', true),
('Family Tax Benefit', 'family', 'Financial support for families with children', 100, 300, 80000, 'https://www.servicesaustralia.gov.au/family-tax-benefit', true);

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- Monthly expense summary by category
CREATE OR REPLACE VIEW monthly_expense_summary AS
SELECT 
    user_id,
    EXTRACT(YEAR FROM date) as year,
    EXTRACT(MONTH FROM date) as month,
    category,
    SUM(amount) as total_amount,
    COUNT(*) as transaction_count,
    AVG(amount) as avg_amount
FROM expenses
GROUP BY user_id, year, month, category;

-- Budget vs actual spending
CREATE OR REPLACE VIEW budget_vs_actual AS
SELECT 
    b.user_id,
    b.month,
    b.year,
    b.category,
    b.amount as budget_amount,
    COALESCE(SUM(e.amount), 0) as actual_amount,
    b.amount - COALESCE(SUM(e.amount), 0) as remaining,
    CASE 
        WHEN COALESCE(SUM(e.amount), 0) > b.amount THEN 'over'
        WHEN COALESCE(SUM(e.amount), 0) >= b.amount * 0.9 THEN 'warning'
        ELSE 'good'
    END as status
FROM budgets b
LEFT JOIN expenses e ON 
    b.user_id = e.user_id AND 
    b.category = e.category AND
    EXTRACT(MONTH FROM e.date) = b.month AND
    EXTRACT(YEAR FROM e.date) = b.year
GROUP BY b.user_id, b.month, b.year, b.category, b.amount;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_government_benefits_updated_at BEFORE UPDATE ON government_benefits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_savings_goals_updated_at BEFORE UPDATE ON savings_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA FOR DEMO
-- ============================================

-- Create demo user (password: demo123)
INSERT INTO users (email, password, name, location, is_premium) VALUES
('demo@pocketplan.com', '$2b$10$rQJ5gZYKJ5L5Z5Z5Z5Z5ZeqGqGqGqGqGqGqGqGqGqGqGqGqGqGqG', 'Alex Johnson', 'Melbourne, VIC', true);

-- Get the demo user ID (will be 1 if this is first user)
-- Insert sample expenses for demo user
INSERT INTO expenses (user_id, amount, category, description, date, payment_method) VALUES
(1, 12.50, 'food', 'Lunch - Pizza Place', CURRENT_DATE, 'card'),
(1, 65.00, 'transport', 'Fuel - Shell Station', CURRENT_DATE - INTERVAL '1 day', 'card'),
(1, 800.00, 'housing', 'Rent Payment', CURRENT_DATE - INTERVAL '2 days', 'bank_transfer'),
(1, 45.80, 'food', 'Groceries - Woolworths', CURRENT_DATE - INTERVAL '3 days', 'card'),
(1, 120.00, 'utilities', 'Electricity Bill', CURRENT_DATE - INTERVAL '5 days', 'bank_transfer');

-- Insert sample budgets for demo user
INSERT INTO budgets (user_id, category, amount, month, year) VALUES
(1, 'food', 600, EXTRACT(MONTH FROM CURRENT_DATE), EXTRACT(YEAR FROM CURRENT_DATE)),
(1, 'housing', 1500, EXTRACT(MONTH FROM CURRENT_DATE), EXTRACT(YEAR FROM CURRENT_DATE)),
(1, 'transport', 500, EXTRACT(MONTH FROM CURRENT_DATE), EXTRACT(YEAR FROM CURRENT_DATE)),
(1, 'utilities', 200, EXTRACT(MONTH FROM CURRENT_DATE), EXTRACT(YEAR FROM CURRENT_DATE));

-- Insert sample community posts
INSERT INTO posts (user_id, content, location) VALUES
(1, 'Found a great trick: buy groceries after 7pm for 50% off markdown items at Woolies. Saved $40 this week!', 'Melbourne, VIC');

-- ============================================
-- GRANT PERMISSIONS (adjust as needed)
-- ============================================

-- Example: Grant permissions to application user
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO pocketplan_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO pocketplan_app;

-- ============================================
-- PERFORMANCE OPTIMIZATION
-- ============================================

-- Analyze tables for query optimization
ANALYZE users;
ANALYZE expenses;
ANALYZE budgets;
ANALYZE posts;
ANALYZE government_benefits;