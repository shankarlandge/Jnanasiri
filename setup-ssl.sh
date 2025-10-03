#!/bin/bash

# Jnanashiri LMS - Automated SSL Setup Script
# Run this script AFTER DNS is configured to point to this server

set -e

echo "🔒 Jnanashiri LMS - SSL Certificate Setup"
echo "========================================"

# Configuration
DOMAIN="jnanasiri.com"
EMAIL="contactsanket1@gmail.com"
APP_DIR="/home/ubuntu/jnanasiri-lms"

# Check if DNS is configured
echo "📡 Checking DNS configuration..."
if ! dig +short $DOMAIN | grep -q "13.200.66.247"; then
    echo "❌ DNS not configured properly. Please set up DNS A record first:"
    echo "   Domain: $DOMAIN -> 13.200.66.247"
    echo "   Domain: www.$DOMAIN -> 13.200.66.247"
    exit 1
fi
echo "✅ DNS configured correctly"

# Install nginx on host temporarily
echo "📦 Installing nginx on host..."
sudo apt update
sudo apt install -y nginx

# Stop Docker frontend container
echo "🛑 Stopping Docker containers..."
cd $APP_DIR
sudo docker-compose stop frontend

# Configure nginx on host
echo "🔧 Configuring nginx on host..."
sudo cp nginx-ssl-ready.conf /etc/nginx/sites-available/$DOMAIN
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo cp -r frontend-dist/* /var/www/html/

# Test nginx configuration
sudo nginx -t
sudo systemctl start nginx
sudo systemctl enable nginx

# Obtain SSL certificate
echo "🔐 Obtaining SSL certificate from Let's Encrypt..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN \
    --email $EMAIL \
    --agree-tos \
    --non-interactive \
    --redirect

# Copy certificates for Docker
echo "📋 Copying certificates for Docker..."
sudo mkdir -p $APP_DIR/ssl
sudo cp -L /etc/letsencrypt/live/$DOMAIN/* $APP_DIR/ssl/
sudo chown -R ubuntu:ubuntu $APP_DIR/ssl

# Update nginx config for Docker with SSL
cat > $APP_DIR/nginx.conf << 'EOF'
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name jnanasiri.com www.jnanasiri.com;
    
    location /.well-known/acme-challenge/ {
        root /usr/share/nginx/html;
        allow all;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name jnanasiri.com www.jnanasiri.com;
    
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    root /usr/share/nginx/html;
    index index.html;

    # Frontend - SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API routes
    location /api/ {
        proxy_pass http://backend:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://backend:3002/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        access_log off;
    }

    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }
}
EOF

# Update Dockerfile.frontend to include SSL certificates
cat > $APP_DIR/Dockerfile.frontend << 'EOF'
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy pre-built frontend files
COPY frontend-dist/ /usr/share/nginx/html/

# Copy SSL certificates
COPY ssl/ /etc/nginx/ssl/

# Expose ports
EXPOSE 80 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
EOF

# Stop host nginx
echo "🛑 Stopping host nginx..."
sudo systemctl stop nginx
sudo systemctl disable nginx

# Start Docker containers with SSL
echo "🚀 Starting Docker containers with SSL..."
sudo docker-compose down
sudo docker-compose up --build -d

# Set up certificate renewal
echo "🔄 Setting up certificate renewal..."
(crontab -l 2>/dev/null; echo "0 2 1 * * /usr/bin/certbot renew --quiet --deploy-hook 'docker-compose -f $APP_DIR/docker-compose.yml restart frontend'") | crontab -

echo ""
echo "✅ SSL Certificate setup completed successfully!"
echo ""
echo "🌐 Your application is now available at:"
echo "   https://$DOMAIN"
echo "   https://www.$DOMAIN"
echo ""
echo "🔐 SSL Certificate will auto-renew monthly"
echo "📊 Test SSL rating at: https://www.ssllabs.com/ssltest/"
echo ""
echo "Admin Access:"
echo "   https://$DOMAIN/admin"
echo "   contactsanket1@gmail.com / Sanket@3030"
echo "   jnanasiriinstitute@gmail.com / Jnanasiri@123456"