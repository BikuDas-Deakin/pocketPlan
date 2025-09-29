# PocketPlan - Smart Financial Management Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![Node](https://img.shields.io/badge/Node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

**Student:** Bisheshwar Das (s225010182)  
**Unit:** SIT317/SIT726 - Information Technology Innovations and Entrepreneurship  
**Task:** 8.2HD High-Fidelity Prototype

A modern web-based financial management platform designed to help Australians take control of their finances through intelligent income and expense tracking, real-time insights, and intuitive visualizations.

🔗 **Live Demo:** [https://pocket-plan-seven.vercel.app/](https://pocket-plan-seven.vercel.app/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Design System](#design-system)
- [Testing Strategy](#testing-strategy)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

### Problem Statement

The rising cost of living in Australia has placed significant financial pressure on individuals and families. Many people struggle to track their expenses, manage budgets effectively, and optimize their spending patterns. Existing financial management tools often lack personalization, are too complex for everyday use, or fail to provide actionable insights.

### Solution

PocketPlan is a web-based financial management platform that provides users with an intuitive interface to record transactions, visualize spending patterns, and gain insights into their financial health. Unlike generic budgeting applications, PocketPlan focuses on **simplicity and accessibility** while providing powerful features for comprehensive financial management.

### Target Audience

- Young professionals managing their first independent finances
- Families seeking to optimize household budgets
- Students tracking limited income and expenses
- Anyone looking for a simple, effective personal finance tool

---

## ✨ Features

### Core Functionality

#### 🔐 Secure Authentication
- User registration and login with JWT authentication
- Password hashing with bcrypt
- Protected routes and automatic token refresh
- Seamless experience across devices

#### 📊 Comprehensive Dashboard
- **Real-time financial overview** with balance calculation
- **Dual tracking:** Both income and expenses displayed prominently
- Total balance (income - expenses)
- Total income with green positive indicators
- Total expenses with red negative indicators
- Recent transactions list with category icons
- Quick-add transaction button for immediate access

#### ➕ Transaction Management
- **Income & Expense Recording** with streamlined interface
- Toggle between transaction types
- Category selection from predefined options
- Description field for transaction details
- Date picker for backdating transactions
- Form validation and error handling
- Immediate backend synchronization

#### 📈 Financial Insights & Analytics
- Data visualization with charts and graphs
- Category-wise spending breakdown
- Income vs. expense comparisons
- Trend analysis over time periods
- Summary statistics and key metrics
- Interactive elements for detailed exploration

#### 💰 Budget Management (Framework)
- Set spending limits by category
- Budget vs. actual spending comparisons
- Alert system for approaching budget limits

#### 💡 Money-Saving Tips
- Curated financial advice and tips
- Context-aware suggestions
- Community-driven knowledge sharing potential

#### 🏛️ Government Support Information
- Information on available rebates and subsidies
- Eligibility checkers for support programs
- Direct links to government resources

#### ⚙️ Settings & Profile
- User profile management
- Application preferences
- Help and support resources

---

## 🛠 Tech Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces
- **CSS3** - Custom styling with modern features
- **React Router** - Client-side routing for seamless navigation
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Lightweight, scalable web framework
- **JWT** - JSON Web Tokens for secure authentication
- **Bcrypt** - Password hashing for security

### Database
- **Supabase (PostgreSQL)** - Reliable, scalable database with real-time capabilities
- Structured storage for users, transactions, and categories

### Development & Deployment
- **Vercel** - Frontend hosting with automatic deployments
- **Render** - Backend API hosting with continuous deployment
- **Docker** - Container configuration for consistent environments
- **Git/GitHub** - Version control and collaboration

---

## 📁 Project Structure

```
SIT726_8.2HD_High-fidelity Prototype/
├── frontend/
│   └── src/
│       ├── screens/              # Page components
│       │   ├── Welcome.jsx       # Authentication screen
│       │   ├── Dashboard.jsx     # Main financial overview
│       │   ├── AddTransaction.jsx # Income/expense recording
│       │   ├── Insights.jsx      # Analytics and visualizations
│       │   ├── Budget.jsx        # Budget management
│       │   ├── Tips.jsx          # Money-saving tips
│       │   ├── Government.jsx    # Government support info
│       │   └── More.jsx          # Settings and profile
│       ├── components/           # Reusable components
│       │   └── BottomNav.jsx     # Navigation bar
│       ├── hooks/                # Custom React hooks
│       ├── api/                  # Backend API integration
│       ├── App.js                # Main application
│       └── index.js              # Entry point
├── server.js                     # Express backend server
├── database.sql                  # PostgreSQL schema
├── Dockerfile                    # Container configuration
├── docker-compose.yml            # Multi-container setup
├── deploy.sh                     # Deployment automation
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14 (or Supabase account)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/BikuDas-Deakin/pocketPlan.git
cd pocketPlan
```

2. **Install dependencies**
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ..
npm install
```

3. **Setup database**
```bash
# Create PostgreSQL database
createdb pocketplan

# Run schema
psql pocketplan < database.sql

# Or configure Supabase connection
```

4. **Configure environment variables**
```bash
# Backend (.env)
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key_here
NODE_ENV=development

# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000
```

5. **Start development servers**

**Backend:**
```bash
npm run dev
# Server runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm start
# App opens on http://localhost:3000
```

6. **Access application**
```
Frontend: http://localhost:3000
Backend API: http://localhost:5000/api
```

---

## 🌐 Deployment

### Deploy to Vercel (Frontend)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy frontend**
```bash
cd frontend
vercel
```

3. **Configure environment variables** in Vercel dashboard
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

### Deploy to Render (Backend)

1. Create new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `NODE_ENV=production`
4. Deploy

### Using Docker

```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d

# Stop containers
docker-compose down
```

---

## 📡 API Documentation

### Base URL
```
Production: https://pocketplan-backend.onrender.com/api
Development: http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Transaction Endpoints

#### Get All Transactions
```http
GET /api/transactions
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "transactions": [
    {
      "id": 1,
      "user_id": 1,
      "type": "expense",
      "amount": 45.50,
      "category": "Food & Dining",
      "description": "Groceries",
      "date": "2025-09-29",
      "created_at": "2025-09-29T10:30:00Z"
    }
  ]
}
```

#### Create Transaction
```http
POST /api/transactions
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "expense",
  "amount": 45.50,
  "category": "Food & Dining",
  "description": "Groceries",
  "date": "2025-09-29"
}
```

#### Update Transaction
```http
PUT /api/transactions/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 50.00,
  "category": "Food & Dining",
  "description": "Updated groceries"
}
```

#### Delete Transaction
```http
DELETE /api/transactions/:id
Authorization: Bearer {token}
```

### Insights Endpoints

#### Get Financial Insights
```http
GET /api/insights
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "totalIncome": 5000.00,
  "totalExpenses": 3500.00,
  "balance": 1500.00,
  "categoryBreakdown": [
    {
      "category": "Food & Dining",
      "amount": 800.00,
      "percentage": 22.86
    }
  ],
  "monthlyTrend": []
}
```

---

## 🗃 Database Schema

### Tables

#### users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### transactions
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) CHECK (type IN ('income', 'expense')),
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### categories
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(20) CHECK (type IN ('income', 'expense')),
  icon VARCHAR(50)
);
```

---

## 🎨 Design System

### Color Palette

**Primary Colors:**
- **Primary Blue:** `#1E3A8A` - Main brand color, buttons, navigation
- **Success Green:** `#10B981` - Income, savings, positive actions
- **Warning Orange:** `#F59E0B` - Warnings and budget alerts
- **Neutral Gray:** `#6B7280` - Secondary text and UI elements

**Background Colors:**
- **White:** `#FFFFFF` - Primary content areas
- **Light Gray:** `#F0F2F5` - App background
- **Card White:** `#E5E7EB` - Card borders
- **Light Blue:** `#F0F7FF` - Accent backgrounds

**Gradients:**
- **Green Gradient:** `linear-gradient(135deg, #ECFDF5, #D1FAE5)` - Savings
- **Blue Gradient:** `linear-gradient(135deg, #F0F7FF, #E6F3FF)` - Features

### Typography

**Font Family:** System font stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Text Hierarchy:**
- **Heading Large:** 24px, Bold - Page titles
- **Heading Medium:** 20px, Semi-bold - Section headings
- **Body Text:** 16px, Regular - Primary content
- **Caption:** 14px, Regular - Secondary information
- **Button Text:** 16px, Semi-bold - Call-to-action buttons

### UI Components

**Cards:**
- Border radius: 12px
- Border: 1px solid #E5E7EB
- Padding: 20px
- No shadows (flat design)

**Buttons:**
- Primary: Navy blue background, white text
- Secondary: Light gray background, dark text
- Action: Green background for save actions
- Padding: 15px vertical
- Border radius: 8px

**Forms:**
- Input border: 2px solid #E5E7EB
- Focus border: 2px solid #1E3A8A
- Padding: 15px
- Border radius: 8px

---

## 🧪 Testing Strategy

### Testing Objectives
1. **Functionality** - All features work as intended
2. **Usability** - Interface is intuitive and user-friendly
3. **Security** - User data is protected
4. **Performance** - Application responds quickly
5. **Compatibility** - Works across different devices and browsers

### Functional Testing Checklist

**Authentication:**
- [x] User registration with valid data
- [x] Login with correct credentials
- [x] Error handling for incorrect credentials
- [x] JWT token generation and validation
- [x] Protected route access control

**Transaction Management:**
- [x] Add income transactions
- [x] Add expense transactions
- [x] Transaction data persistence
- [x] Real-time dashboard updates
- [x] Category selection

**Dashboard:**
- [x] Correct balance calculation
- [x] Accurate income display
- [x] Accurate expense display
- [x] Recent transactions list

### Usability Testing

**Test Scenarios:**
1. Register new account and complete first login
2. Add expense transaction with category
3. Record income transaction
4. Review dashboard financial summary
5. View insights and analytics
6. Navigate between sections

**Evaluation Metrics:**
- Task completion rate
- Time to complete tasks
- Number of errors
- User satisfaction (1-5 scale)
- Net Promoter Score (NPS)

### Cross-Browser Testing

**Browsers:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Devices:**
- Desktop (1920x1080, 1366x768)
- Tablet (iPad, Android tablet)
- Mobile (iPhone, Android phone)

### Performance Testing

**Target Metrics:**
- Page load time: < 3 seconds
- Time to interactive: < 5 seconds
- API response time: < 500ms

**Tools:**
- Chrome DevTools Lighthouse
- Network tab monitoring
- Performance profiling

---

## 🚧 Future Enhancements

### Planned Features

**Phase 1:**
- [ ] Complete budget management implementation with alerts
- [ ] Receipt scanning with OCR integration
- [ ] Recurring transaction support
- [ ] PDF reports and CSV export
- [ ] Multi-currency support

**Phase 2:**
- [ ] AI-powered insights with predictive analytics
- [ ] Personalized recommendations
- [ ] Community forum for sharing tips
- [ ] Bill payment reminders
- [ ] Subscription tracking

**Phase 3:**
- [ ] Native mobile apps (iOS/Android)
- [ ] Real-time notifications
- [ ] Open Banking API integration
- [ ] Gamification and achievements
- [ ] Family account sharing

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token-based authentication
- ✅ SQL injection protection via parameterized queries
- ✅ CORS configured for allowed origins
- ✅ Input validation on all endpoints
- ✅ HTTPS required in production
- ✅ Secure token storage

---

## 📝 License

MIT License - This project is open source and available for educational purposes.

---

## 🙏 Acknowledgments

- **Deakin University** - For project guidance and support
- **React Community** - For excellent documentation and resources
- **Vercel & Render** - For reliable hosting platforms
- **Supabase** - For powerful database services
- **Australian Community** - For insights on cost-of-living challenges

---

## 📧 Contact

**Student:** Bisheshwar Das  
**Student ID:** s225010182  
**Email:** bisheshwdar@gmail.com  
**GitHub:** [https://github.com/BikuDas-Deakin/pocketPlan](https://github.com/BikuDas-Deakin/pocketPlan)

---

## 📚 References

- React Documentation: [https://react.dev/](https://react.dev/)
- Node.js Documentation: [https://nodejs.org/](https://nodejs.org/)
- Express.js Documentation: [https://expressjs.com/](https://expressjs.com/)
- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Services Australia: [https://www.servicesaustralia.gov.au/](https://www.servicesaustralia.gov.au/)

---

**Version:** 1.0.0  
**Last Updated:** September 29, 2025  
**Status:** Production Ready ✅
