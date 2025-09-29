#!/bin/bash

# PocketPlan Quick Deployment Script
# Usage: ./deploy.sh [platform]
# Platforms: railway | render | heroku | docker

set -e

echo "🚀 PocketPlan Deployment Script"
echo "================================"
echo ""

PLATFORM=${1:-railway}

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_dependencies() {
    echo "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ All dependencies found${NC}"
}

# Install npm packages
install_packages() {
    echo -e "${BLUE}📦 Installing packages...${NC}"
    npm install
    echo -e "${GREEN}✓ Packages installed${NC}"
}

# Setup environment
setup_env() {
    if [ ! -f .env ]; then
        echo -e "${BLUE}⚙️  Creating .env file...${NC}"
        cp .env.example .env
        echo -e "${GREEN}✓ .env file created. Please update with your values!${NC}"
    else
        echo -e "${GREEN}✓ .env file already exists${NC}"
    fi
}

# Railway deployment
deploy_railway() {
    echo -e "${BLUE}🚂 Deploying to Railway...${NC}"
    
    if ! command -v railway &> /dev/null; then
        echo "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    echo "Logging in to Railway..."
    railway login
    
    echo "Initializing project..."
    railway init
    
    echo "Adding PostgreSQL..."
    railway add postgresql
    
    echo "Setting environment variables..."
    railway variables set NODE_ENV=production
    railway variables set JWT_SECRET=$(openssl rand -base64 32)
    
    echo "Deploying..."
    railway up
    
    echo -e "${GREEN}✓ Deployed to Railway!${NC}"
    railway open
}

# Render deployment
deploy_render() {
    echo -e "${BLUE}🎨 Deploying to Render...${NC}"
    echo ""
    echo "To deploy to Render:"
    echo "1. Go to https://render.com"
    echo "2. Create New > Web Service"
    echo "3. Connect your GitHub repository"
    echo "4. Configure:"
    echo "   - Build Command: npm install"
    echo "   - Start Command: npm start"
    echo "5. Add PostgreSQL database"
    echo "6. Set environment variables from .env"
    echo "7. Deploy"
    echo ""
    echo "Press any key when ready to continue..."
    read -n 1 -s
}

# Heroku deployment
deploy_heroku() {
    echo -e "${BLUE}💜 Deploying to Heroku...${NC}"
    
    if ! command -v heroku &> /dev/null; then
        echo "Installing Heroku CLI..."
        curl https://cli-assets.heroku.com/install.sh | sh
    fi
    
    echo "Logging in to Heroku..."
    heroku login
    
    echo "Creating Heroku app..."
    heroku create pocketplan-$(date +%s)
    
    echo "Adding PostgreSQL..."
    heroku addons:create heroku-postgresql:mini
    
    echo "Setting environment variables..."
    heroku config:set NODE_ENV=production
    heroku config:set JWT_SECRET=$(openssl rand -base64 32)
    
    echo "Deploying..."
    git push heroku main
    
    echo "Running database migrations..."
    heroku pg:psql < database.sql
    
    echo -e "${GREEN}✓ Deployed to Heroku!${NC}"
    heroku open
}

# Docker deployment
deploy_docker() {
    echo -e "${BLUE}🐳 Building Docker containers...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed${NC}"
        exit 1
    fi
    
    echo "Building images..."
    docker-compose build
    
    echo "Starting containers..."
    docker-compose up -d
    
    echo "Waiting for database..."
    sleep 10
    
    echo "Running migrations..."
    docker-compose exec api psql $DATABASE_URL < database.sql
    
    echo -e "${GREEN}✓ Docker containers running!${NC}"
    echo "App: http://localhost:3000"
    echo "Database: localhost:5432"
}

# Main deployment flow
main() {
    check_dependencies
    install_packages
    setup_env
    
    echo ""
    echo "Selected platform: ${PLATFORM}"
    echo ""
    
    case $PLATFORM in
        railway)
            deploy_railway
            ;;
        render)
            deploy_render
            ;;
        heroku)
            deploy_heroku
            ;;
        docker)
            deploy_docker
            ;;
        *)
            echo -e "${RED}Unknown platform: ${PLATFORM}${NC}"
            echo "Usage: ./deploy.sh [railway|render|heroku|docker]"
            exit 1
            ;;
    esac
    
    echo ""
    echo -e "${GREEN}🎉 Deployment complete!${NC}"
}

# Run main function
main