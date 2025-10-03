#!/bin/bash

# AWS EC2 Deployment Script for Jnanasiri LMS
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment to AWS EC2..."

# Configuration
EC2_HOST="13.200.66.247"
EC2_USER="ubuntu"
PEM_KEY="/Users/sanketmane/Downloads/formo.pem"
APP_NAME="jnanasiri-lms"
DEPLOY_PATH="/home/ubuntu/jnanasiri-lms"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if PEM key exists
if [ ! -f "$PEM_KEY" ]; then
    print_error "PEM key not found at $PEM_KEY"
    exit 1
fi

# Set correct permissions for PEM key
chmod 400 "$PEM_KEY"

print_status "Building production assets..."

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Create deployment package
print_status "Creating deployment package..."

# Remove existing deployment package
rm -rf deployment-package
mkdir -p deployment-package

# Copy necessary files
cp -r backend deployment-package/
cp -r frontend/dist deployment-package/frontend-dist
cp docker-compose.production.yml deployment-package/docker-compose.yml
cp Dockerfile.backend deployment-package/
cp Dockerfile.frontend deployment-package/
cp nginx.conf deployment-package/

# Create deployment archive
tar -czf jnanasiri-lms-deployment.tar.gz deployment-package/

print_status "Uploading to EC2 instance..."

# Upload deployment package
scp -i "$PEM_KEY" jnanasiri-lms-deployment.tar.gz ubuntu@$EC2_HOST:/tmp/

print_status "Deploying on EC2 instance..."

# Deploy on EC2
ssh -i "$PEM_KEY" ubuntu@$EC2_HOST << 'ENDSSH'
    set -e
    
    echo "🔧 Setting up environment on EC2..."
    
    # Update system packages
    sudo apt update
    
    # Install Docker if not already installed
    if ! command -v docker &> /dev/null; then
        echo "Installing Docker..."
        sudo apt install -y docker.io
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker ubuntu
    fi
    
    # Install Docker Compose if not already installed
    if ! command -v docker-compose &> /dev/null; then
        echo "Installing Docker Compose..."
        sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
    
    # Install Node.js and npm if not already installed
    if ! command -v node &> /dev/null; then
        echo "Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt install -y nodejs
    fi
    
    # Create application directory
    sudo mkdir -p /home/ubuntu/jnanasiri-lms
    sudo chown ubuntu:ubuntu /home/ubuntu/jnanasiri-lms
    
    # Extract deployment package
    cd /home/ubuntu/jnanasiri-lms
    
    # Stop existing containers if any
    if [ -f docker-compose.yml ]; then
        docker-compose down || true
    fi
    
    # Remove old files
    rm -rf *
    
    # Extract new deployment
    tar -xzf /tmp/jnanasiri-lms-deployment.tar.gz --strip-components=1
    
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install --production
    cd ..
    
    echo "🐳 Starting Docker containers..."
    
    # Start services with Docker Compose
    docker-compose up --build -d
    
    echo "⏳ Waiting for services to start..."
    sleep 30
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        echo "✅ Services started successfully!"
        docker-compose ps
    else
        echo "❌ Some services failed to start"
        docker-compose logs
        exit 1
    fi
    
    echo "🔍 Service status:"
    docker-compose ps
    
    echo "📊 Checking application health..."
    
    # Test backend health
    if curl -f http://localhost:3002/health > /dev/null 2>&1; then
        echo "✅ Backend is healthy"
    else
        echo "⚠️ Backend health check failed"
    fi
    
    # Test frontend
    if curl -f http://localhost:80 > /dev/null 2>&1; then
        echo "✅ Frontend is accessible"
    else
        echo "⚠️ Frontend health check failed"
    fi
    
    echo "🎉 Deployment completed!"
    echo "🌐 Your application should be accessible at: http://13.200.66.247"
    echo "📋 Admin accounts created:"
    echo "   - contactsanket1@gmail.com (Password: Sanket@3030)"
    echo "   - jnanasiriinstitute@gmail.com (Password: Jnanasiri@123456)"
    
ENDSSH

# Clean up local files
rm -f jnanasiri-lms-deployment.tar.gz
rm -rf deployment-package

print_status "Deployment completed successfully!"
print_status "Application URL: http://$EC2_HOST"
print_status "Domain: https://jnanasiri.com (configure DNS to point to $EC2_HOST)"

echo ""
echo "🎯 Next Steps:"
echo "1. Configure your domain DNS to point to $EC2_HOST"
echo "2. Set up SSL certificate (Let's Encrypt recommended)"
echo "3. Configure firewall rules if needed"
echo "4. Monitor application logs: ssh -i $PEM_KEY ubuntu@$EC2_HOST 'cd /home/ubuntu/jnanasiri-lms && docker-compose logs -f'"