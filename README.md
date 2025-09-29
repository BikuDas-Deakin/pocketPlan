# PocketPlan - Smart Cost of Living Management

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

**Team ASBOT** - SIT726 Innovation & Entrepreneurship Project

A mobile-first web application designed to help Australians manage their cost of living through AI-powered expense tracking, community-driven insights, and government benefit integration.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [Team](#team)

---

## ✨ Features

### Core Functionality
- **Expense Tracking** - Quick-add expenses with category tagging
- **Budget Management** - Set and monitor category-based budgets
- **AI-Powered Insights** - Machine learning recommendations for cost savings
- **OCR Receipt Scanning** - Automated expense capture from receipts
- **Visual Analytics** - Interactive charts and spending breakdowns

### Community Features
- **Community Forum** - Share cost-saving tips with other users
- **Location-Based Advice** - Find local deals and recommendations
- **Peer Support** - Learn from real experiences

### Government Integration
- **Benefits Discovery** - Access 23+ Australian government support programs
- **Eligibility Checker** - Quick assessment of benefit qualification
- **Direct Application Links** - Streamlined access to official resources

### Additional Features
- **Cross-Platform** - Mobile-first design, works on all devices
- **Privacy-First** - Guest mode with local data storage
- **Progressive Web App** - Install as native app on mobile

---

## 🛠 Tech Stack

### Frontend
- **HTML5 / CSS3** - Semantic markup and modern styling
- **Bootstrap 5** - Responsive component framework
- **Vanilla JavaScript** - No framework dependencies
- **Bootstrap Icons** - Comprehensive icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing

### Future Enhancements
- **Flutter** - Native mobile apps (iOS/Android)
- **React.js** - Enhanced web interface
- **TensorFlow** - Advanced ML models
- **Docker** - Containerization

---

## 📁 Project Structure

```
pocketplan/
├── public/
│   ├── index.html          # Main frontend application
│   ├── css/
│   │   └── styles.css      # Custom styles (if separated)
│   └── js/
│       └── app.js          # Frontend JavaScript (if separated)
├── server.js               # Express API server
├── database.sql            # PostgreSQL schema
├── package.json            # Node dependencies
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm >= 9.0.0

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/team-asbot/pocketplan.git
cd pocketplan
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup database**
```bash
# Create PostgreSQL database
createdb pocketplan

# Run schema
psql pocketplan < database.sql

# Or use npm script
npm run db:setup
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Start development server**
```bash
npm run dev
```

6. **Access application**
```
Frontend: http://localhost:3000
API: http://localhost:3000/api
```

### Demo Credentials
```
Email: demo@pocketplan.com
Password: demo123
```

---

## 🌐 Deployment

### Deploy to Railway (Recommended)

1. **Create Railway account** at [railway.app](https://railway.app)

2. **Install Railway CLI**
```bash
npm install -g @railway/cli
railway login
```

3. **Initialize project**
```bash
railway init
```

4. **Add PostgreSQL**
```bash
railway add postgresql
```

5. **Set environment variables**
```bash
railway variables set JWT_SECRET=your-secret-key
railway variables set NODE_ENV=production
```

6. **Deploy**
```bash
railway up
```

### Deploy to Render

1. Create new Web Service on [render.com](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add PostgreSQL database
5. Set environment variables
6. Deploy

### Deploy to Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create pocketplan-app

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Run database migrations
heroku pg:psql < database.sql
```

---

## 📡 API Documentation

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

**Response:**
```json
{
  "message": "User registered successfully",
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

### Expense Endpoints

#### Get All Expenses
```http
GET /api/expenses
Authorization: Bearer {token}
```

#### Create Expense
```http
POST /api/expenses
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 45.50,
  "category": "food",
  "description": "Groceries",
  "date": "2024-12-15",
  "payment_method": "card"
}
```

#### Update Expense
```http
PUT /api/expenses/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 50.00,
  "category": "food",
  "description": "Updated groceries"
}
```

#### Delete Expense
```http
DELETE /api/expenses/:id
Authorization: Bearer {token}
```

#### Get Expense Statistics
```http
GET /api/expenses/stats/summary?month=12&year=2024
Authorization: Bearer {token}
```

### Budget Endpoints

#### Get Budgets
```http
GET /api/budgets
Authorization: Bearer {token}
```

#### Set Budget
```http
POST /api/budgets
Authorization: Bearer {token}
Content-Type: application/json

{
  "category": "food",
  "amount": 600,
  "month": 12,
  "year": 2024
}
```

### Community Endpoints

#### Get Posts
```http
GET /api/community/posts?limit=20&offset=0
```

#### Create Post
```http
POST /api/community/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Great tip: buy groceries after 7pm for discounts!",
  "location": "Melbourne, VIC"
}
```

#### Like Post
```http
POST /api/community/posts/:id/like
Authorization: Bearer {token}
```

### Benefits Endpoints

#### Get All Benefits
```http
GET /api/benefits
```

#### Check Eligibility
```http
POST /api/benefits/check-eligibility
Authorization: Bearer {token}
Content-Type: application/json

{
  "income": 45000,
  "age": 35,
  "location": "VIC",
  "household_size": 2
}
```

### AI Insights Endpoints

#### Get AI Insights
```http
GET /api/insights/ai
Authorization: Bearer {token}
```

---

## 🗃 Database Schema

### Key Tables

**users** - User accounts and profiles
```sql
id, email, password, name, location, is_premium, created_at, updated_at
```

**expenses** - Transaction records
```sql
id, user_id, amount, category, description, date, payment_method, receipt_url, created_at
```

**budgets** - Budget allocations
```sql
id, user_id, category, amount, month, year, created_at
```

**posts** - Community forum posts
```sql
id, user_id, content, location, created_at
```

**government_benefits** - Available support programs
```sql
id, name, category, description, amount_min, amount_max, income_threshold, application_url
```

**ai_insights** - ML-generated recommendations
```sql
id, user_id, insight_type, category, message, potential_savings, status
```

### Views

- `monthly_expense_summary` - Aggregated spending by category
- `budget_vs_actual` - Budget compliance tracking

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Manual Testing Checklist

**Authentication**
- [ ] User registration works
- [ ] Login works
- [ ] JWT tokens are generated
- [ ] Protected routes require authentication

**Expenses**
- [ ] Can create expense
- [ ] Can view all expenses
- [ ] Can update expense
- [ ] Can delete expense
- [ ] Statistics calculate correctly

**Budgets**
- [ ] Can set budget
- [ ] Budget tracking works
- [ ] Warnings show when over budget

**Community**
- [ ] Can view posts
- [ ] Can create post
- [ ] Can like posts

**Benefits**
- [ ] Benefits list displays
- [ ] Eligibility checker works

---

## 🔒 Security Considerations

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for stateless authentication
- SQL injection protection via parameterized queries
- CORS configured for allowed origins
- Rate limiting on API endpoints
- Input validation on all endpoints
- HTTPS required in production

---

## 🚧 Future Enhancements

### Phase 2 (Q1 2025)
- [ ] Flutter mobile apps (iOS/Android)
- [ ] Real OCR integration (Google Vision API)
- [ ] Open Banking API integration
- [ ] Advanced ML models (TensorFlow)
- [ ] Push notifications
- [ ] Email reports

### Phase 3 (Q2 2025)
- [ ] Real-time chat in community
- [ ] Gamification and achievements
- [ ] Bill payment reminders
- [ ] Subscription tracking
- [ ] Export to CSV/PDF
- [ ] Multi-currency support

---

## 👥 Team ASBOT

- **Thoran Kumar** - Full-stack Developer
- **Akashdeep Singh** - Backend & Database
- **Bishewar Das** - Frontend & UX
- **Arun** - AI/ML Integration
- **Ojusvi Wadhwa** - Community Features
- **Shyam Kumar** - Government API Integration

**Institution:** Deakin University  
**Unit:** SIT726 - Information Technology Innovations and Entrepreneurship  
**Trimester:** T3 2024

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📧 Contact

Project Link: [https://github.com/team-asbot/pocketplan](https://github.com/team-asbot/pocketplan)

For support: support@pocketplan.com

---

## 🙏 Acknowledgments

- Services Australia for government benefits data
- Bootstrap team for the excellent framework
- Deakin University for project support
- Australian community for cost-of-living insights

---
# pocketPlan
