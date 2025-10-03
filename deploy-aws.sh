#!/bin/bash

# Janashiri LMS - Quick Deployment Script for AWS EC2 Ubuntu
# This script automates the deployment of Janashiri LMS using Docker Hub images

set -e

echo "🚀 Janashiri LMS - AWS EC2 Ubuntu Deployment Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as ubuntu user."
   exit 1
fi

# Step 1: Update system
print_step "1. Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Step 2: Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    print_step "2. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    print_status "Docker installed successfully. You may need to log out and back in."
else
    print_status "Docker is already installed."
fi

# Step 3: Install Docker Compose if not already installed
if ! command -v docker-compose &> /dev/null; then
    print_step "3. Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_status "Docker Compose installed successfully."
else
    print_status "Docker Compose is already installed."
fi

# Step 4: Create project directory
print_step "4. Creating project directory..."
mkdir -p ~/janashiri-lms
cd ~/janashiri-lms

# Step 5: Create docker-compose.production.yml
print_step "5. Creating docker-compose configuration..."
cat > docker-compose.production.yml << 'EOF'
version: '3.8'

services:
  # Backend Service - LMS API Server
  backend:
    image: sanketsmane/janashiri-lms-backend:1.0
    container_name: janashiri-lms-backend
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - PORT=3002
    env_file:
      - .env.production
    restart: unless-stopped
    networks:
      - lms-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3002/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Frontend Service - React App with Nginx
  frontend:
    image: sanketsmane/janashiri-lms-frontend:1.0
    container_name: janashiri-lms-frontend
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      backend:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - lms-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  lms-network:
    driver: bridge
    name: janashiri-lms-network

volumes:
  ssl_certs:
    driver: local
EOF

# Step 6: Create sample environment file
print_step "6. Creating sample environment file..."
cat > .env.production.example << 'EOF'
# Production Environment Variables for Janashiri LMS
# Copy this to .env.production and update with your actual values

# Server Configuration
NODE_ENV=production
PORT=3002

# Database Configuration - MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/janashiri_lms_prod?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret - Generate a strong secret key
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-random

# CORS Origins - Add your domain and IP addresses
ALLOWED_ORIGINS=https://yourdomain.com,http://yourdomain.com,http://YOUR_EC2_IP,http://localhost:5173

# Cloudinary Configuration for File Uploads
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-admin-password
EOF

print_warning "IMPORTANT: You need to create .env.production file with your actual configuration!"
print_status "Sample file created as .env.production.example"

# Check if .env.production exists
if [[ ! -f .env.production ]]; then
    print_warning "Creating basic .env.production file. Please update it with your actual values!"
    cp .env.production.example .env.production
    
    # Get EC2 public IP
    EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "YOUR_EC2_IP")
    
    if [[ "$EC2_IP" != "YOUR_EC2_IP" ]]; then
        sed -i "s/YOUR_EC2_IP/$EC2_IP/g" .env.production
        print_status "Updated CORS origins with EC2 IP: $EC2_IP"
    fi
    
    print_error "Please edit .env.production file with your MongoDB URI, Cloudinary credentials, and other settings before proceeding!"
    echo "Run: nano .env.production"
    echo ""
    read -p "Press Enter after you've updated .env.production file..."
fi

# Step 7: Pull Docker images
print_step "7. Pulling Docker images from Docker Hub..."
docker-compose -f docker-compose.production.yml pull

# Step 8: Start the application
print_step "8. Starting the application..."
docker-compose -f docker-compose.production.yml up -d

# Step 9: Wait for services to be ready
print_step "9. Waiting for services to be ready..."
sleep 30

# Step 10: Verify deployment
print_step "10. Verifying deployment..."

# Check container status
echo "Container Status:"
docker-compose -f docker-compose.production.yml ps

echo ""
print_status "Testing API health endpoint..."
if curl -f -s http://localhost:3002/api/health > /dev/null; then
    print_status "✅ Backend API is responding!"
else
    print_warning "❌ Backend API is not responding. Check logs with: docker-compose -f docker-compose.production.yml logs backend"
fi

print_status "Testing frontend..."
if curl -f -s http://localhost/ > /dev/null; then
    print_status "✅ Frontend is responding!"
else
    print_warning "❌ Frontend is not responding. Check logs with: docker-compose -f docker-compose.production.yml logs frontend"
fi

# Get EC2 public IP for final instructions
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "YOUR_EC2_IP")

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
print_status "Your Janashiri LMS application is now running!"
echo ""
echo "Access URLs:"
echo "- Frontend: http://$EC2_IP"
echo "- Backend API: http://$EC2_IP:3002/api/health"
echo ""
echo "Useful Commands:"
echo "- View logs: docker-compose -f docker-compose.production.yml logs -f"
echo "- Restart: docker-compose -f docker-compose.production.yml restart"
echo "- Stop: docker-compose -f docker-compose.production.yml down"
echo "- Update: docker-compose -f docker-compose.production.yml pull && docker-compose -f docker-compose.production.yml up -d"
echo ""
print_warning "Remember to:"
print_warning "1. Configure your AWS Security Group to allow ports 80, 443, and 3002"
print_warning "2. Update .env.production with your actual database and API credentials"
print_warning "3. Set up SSL certificates for production domains"
echo ""
print_status "Deployment script completed successfully!"