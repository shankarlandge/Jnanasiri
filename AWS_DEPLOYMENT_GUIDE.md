# Janashiri LMS - AWS EC2 Ubuntu Deployment Guide

## 🚀 Quick Deployment Overview

This guide explains how to deploy the Janashiri LMS application using Docker images from Docker Hub on AWS EC2 Ubuntu instances.

## 📦 Docker Images Available

- **Backend**: `sanketsmane/janashiri-lms-backend:1.0`
- **Frontend**: `sanketsmane/janashiri-lms-frontend:1.0`

Both images are also available as `:latest` tags.

## 🛠️ Prerequisites

### AWS EC2 Instance Requirements
- **Instance Type**: t3.medium or larger (minimum 4GB RAM)
- **Operating System**: Ubuntu 22.04 LTS or 20.04 LTS
- **Storage**: Minimum 20GB SSD
- **Security Group**: Open ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 3002 (Backend API)

### Required Software
- Docker Engine
- Docker Compose
- Git (optional, for cloning configuration files)

## 📋 Step-by-Step Deployment

### 1. Launch and Connect to EC2 Instance

```bash
# Connect via SSH
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
```

### 2. Install Docker and Docker Compose

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Log out and log back in, or run:
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 3. Create Project Directory

```bash
# Create project directory
mkdir ~/janashiri-lms
cd ~/janashiri-lms
```

### 4. Create Configuration Files

#### Create docker-compose.production.yml:

```yaml
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
    volumes:
      # Mount SSL certificates directory (create this on your server)
      - ./ssl:/etc/nginx/ssl:ro
      # Mount custom nginx config if needed
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
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
```

#### Create .env.production file:

```bash
# Create environment file
nano .env.production
```

Add the following content (replace with your actual values):

```env
# Production Environment Variables for Janashiri LMS

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

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=12
SESSION_SECRET=another-random-secret-for-sessions
```

### 5. Deploy the Application

```bash
# Pull the latest images
docker-compose -f docker-compose.production.yml pull

# Start the application
docker-compose -f docker-compose.production.yml up -d

# Check container status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f
```

### 6. Verify Deployment

```bash
# Check if API is responding
curl http://localhost:3002/api/health

# Check if frontend is loading
curl http://localhost/

# Check from external IP
curl http://YOUR_EC2_IP/api/health
```

## 🔒 SSL/HTTPS Setup (Optional)

### Install Certbot for Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Stop nginx temporarily
docker-compose -f docker-compose.production.yml stop frontend

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Create SSL directory
mkdir ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/
sudo chown -R ubuntu:ubuntu ssl/

# Restart frontend with SSL
docker-compose -f docker-compose.production.yml up -d frontend
```

## 🔧 Maintenance Commands

### Update Application

```bash
# Pull latest images
docker-compose -f docker-compose.production.yml pull

# Restart services
docker-compose -f docker-compose.production.yml up -d
```

### Monitor Logs

```bash
# View all logs
docker-compose -f docker-compose.production.yml logs -f

# View specific service logs
docker-compose -f docker-compose.production.yml logs -f backend
docker-compose -f docker-compose.production.yml logs -f frontend
```

### Backup and Restore

```bash
# Backup environment file
cp .env.production .env.production.backup

# Stop services
docker-compose -f docker-compose.production.yml down

# Start services
docker-compose -f docker-compose.production.yml up -d
```

## 🛡️ Security Best Practices

1. **Firewall Configuration**:
   ```bash
   sudo ufw enable
   sudo ufw allow ssh
   sudo ufw allow 80
   sudo ufw allow 443
   ```

2. **Regular Updates**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   docker-compose -f docker-compose.production.yml pull
   ```

3. **Monitor Resource Usage**:
   ```bash
   docker stats
   htop
   df -h
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Container won't start**: Check logs with `docker-compose logs`
2. **Port conflicts**: Ensure ports 80, 443, 3002 are not used by other services
3. **Database connection**: Verify MongoDB URI in .env.production
4. **API not responding**: Check CORS origins and firewall settings

### Health Check Commands

```bash
# Check container health
docker-compose -f docker-compose.production.yml ps

# Test API endpoints
curl http://localhost:3002/api/health
curl -X POST http://localhost:3002/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin","password":"test"}'

# Check resource usage
docker stats
```

## 📞 Support

For issues and support:
1. Check container logs first
2. Verify environment variables
3. Ensure all prerequisites are met
4. Check AWS security group settings

## 🎉 Success!

Your Janashiri LMS application should now be running at:
- **HTTP**: `http://YOUR_EC2_IP`
- **HTTPS**: `https://yourdomain.com` (if SSL configured)
- **API**: `http://YOUR_EC2_IP:3002/api/health`

The application is production-ready and includes:
- ✅ Auto-restart containers
- ✅ Health checks
- ✅ Proper networking
- ✅ SSL-ready configuration
- ✅ Environment-based configuration