# Jnanashiri LMS - Domain & SSL Configuration Guide

## Current Status
✅ Application successfully deployed on AWS EC2: `http://13.200.66.247`
✅ Frontend and Backend running via Docker containers
✅ MongoDB Atlas connected
✅ Admin users created

## DNS Configuration Required

To make the application accessible via `https://jnanasiri.com`, you need to configure DNS:

### Step 1: Configure DNS A Record
In your domain registrar's DNS settings (where jnanasiri.com is registered):

```
Type: A
Name: @ (or blank for root domain)
Value: 13.200.66.247
TTL: 300 (or minimum allowed)

Type: A  
Name: www
Value: 13.200.66.247
TTL: 300
```

### Step 2: Verify DNS Propagation
After configuring DNS, verify it's working:
```bash
# Check from your local machine
nslookup jnanasiri.com
dig jnanasiri.com

# Should return IP: 13.200.66.247
```

## SSL Certificate Setup (After DNS Configuration)

Once DNS is pointing to the server, run these commands on the EC2 instance:

### Step 1: Update Nginx Configuration
```bash
# SSH to EC2
ssh -i formo.pem ubuntu@13.200.66.247

# Navigate to app directory
cd /home/ubuntu/jnanasiri-lms

# Replace nginx config with SSL-ready version
sudo docker-compose down
cp nginx-ssl-ready.conf nginx.conf
sudo docker-compose up --build -d
```

### Step 2: Obtain SSL Certificate
```bash
# Install nginx temporarily on host (for certbot)
sudo apt install nginx

# Stop Docker nginx temporarily
sudo docker-compose stop frontend

# Copy current site files to host nginx
sudo cp -r frontend-dist/* /var/www/html/
sudo cp nginx-ssl-ready.conf /etc/nginx/sites-available/jnanasiri.com
sudo ln -s /etc/nginx/sites-available/jnanasiri.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Obtain SSL certificate
sudo certbot --nginx -d jnanasiri.com -d www.jnanasiri.com --email contactsanket1@gmail.com --agree-tos --non-interactive

# Copy certificates to Docker volume
sudo mkdir -p /home/ubuntu/jnanasiri-lms/ssl
sudo cp -r /etc/letsencrypt/live/jnanasiri.com/* /home/ubuntu/jnanasiri-lms/ssl/
sudo chown -R ubuntu:ubuntu /home/ubuntu/jnanasiri-lms/ssl
```

### Step 3: Configure Docker with SSL
Update docker-compose.yml to include SSL certificates:

```yaml
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
```

Update nginx.conf to use SSL certificates:
```nginx
server {
    listen 443 ssl http2;
    server_name jnanasiri.com www.jnanasiri.com;
    
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    # ... rest of configuration
}
```

### Step 4: Final Restart
```bash
# Stop host nginx
sudo systemctl stop nginx
sudo systemctl disable nginx

# Restart Docker containers
sudo docker-compose down
sudo docker-compose up --build -d
```

## Certificate Renewal

Set up automatic certificate renewal:
```bash
# Create renewal script
sudo crontab -e

# Add this line for monthly renewal:
0 2 1 * * /usr/bin/certbot renew --quiet && docker-compose -f /home/ubuntu/jnanasiri-lms/docker-compose.yml restart frontend
```

## Security Considerations

1. **Firewall**: Ensure EC2 security group allows:
   - Port 80 (HTTP) from 0.0.0.0/0
   - Port 443 (HTTPS) from 0.0.0.0/0
   - Port 22 (SSH) from your IP only
   - Port 3002 (Backend) - remove if not needed for direct access

2. **Regular Updates**: Keep server and containers updated
   ```bash
   sudo apt update && sudo apt upgrade
   docker-compose pull && docker-compose up --build -d
   ```

3. **Monitoring**: Set up monitoring for:
   - SSL certificate expiration
   - Server resources
   - Application health

## Testing After SSL Setup

Once configured, test:
- https://jnanasiri.com (should load with valid SSL)
- http://jnanasiri.com (should redirect to HTTPS)
- https://www.jnanasiri.com (should work)
- SSL rating: https://www.ssllabs.com/ssltest/

## Admin Access

After SSL setup, access admin panel at:
- https://jnanasiri.com/admin

Admin Credentials:
- Email: contactsanket1@gmail.com | Password: Sanket@3030  
- Email: jnanasiriinstitute@gmail.com | Password: Jnanasiri@123456

## Support

If you need assistance with DNS or SSL configuration, you can:
1. Check DNS propagation at: https://dnschecker.org/
2. Test SSL configuration at: https://www.ssllabs.com/ssltest/
3. Monitor certificate expiration at: https://crt.sh/