# Janashiri LMS - Docker Images

## 🐳 Available Images

### Backend API Server
- **Image**: `sanketsmane/janashiri-lms-backend:1.0`
- **Latest**: `sanketsmane/janashiri-lms-backend:latest`
- **Size**: ~294MB
- **Base**: Node.js 18 Alpine
- **Ports**: 3002

### Frontend Web Application  
- **Image**: `sanketsmane/janashiri-lms-frontend:1.0`
- **Latest**: `sanketsmane/janashiri-lms-frontend:latest`
- **Size**: ~82MB
- **Base**: Nginx Alpine
- **Ports**: 80, 443

## 🚀 Quick Start

### Method 1: Using Docker Compose (Recommended)

```bash
# Download docker-compose file
curl -o docker-compose.yml https://raw.githubusercontent.com/SanketsMane/Janashri_LMS/main/docker-compose.production.yml

# Create environment file
curl -o .env.production https://raw.githubusercontent.com/SanketsMane/Janashri_LMS/main/.env.production.example

# Edit environment variables
nano .env.production

# Start the application
docker-compose up -d
```

### Method 2: Individual Containers

```bash
# Run backend
docker run -d \
  --name janashiri-backend \
  -p 3002:3002 \
  -e NODE_ENV=production \
  sanketsmane/janashiri-lms-backend:1.0

# Run frontend
docker run -d \
  --name janashiri-frontend \
  -p 80:80 \
  -p 443:443 \
  sanketsmane/janashiri-lms-frontend:1.0
```

### Method 3: AWS EC2 Auto-Deploy Script

```bash
# Download and run deployment script
curl -o deploy-aws.sh https://raw.githubusercontent.com/SanketsMane/Janashri_LMS/main/deploy-aws.sh
chmod +x deploy-aws.sh
./deploy-aws.sh
```

## 📋 Required Environment Variables

### Backend (.env.production)
```env
NODE_ENV=production
PORT=3002
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-jwt-secret
ALLOWED_ORIGINS=http://your-domain.com,http://your-ip
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-password
```

## 🛠️ Features Included

- **Learning Management System**: Complete LMS with courses, students, admissions
- **Authentication**: JWT-based admin and student authentication  
- **File Uploads**: Cloudinary integration for images and documents
- **Email System**: Automated notifications and communications
- **Admin Dashboard**: Comprehensive admin panel for management
- **Responsive Design**: Mobile-friendly React frontend
- **API Documentation**: RESTful API with proper error handling
- **Database**: MongoDB Atlas ready
- **Production Ready**: Docker containers with health checks

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │
│   (Nginx)       │────│   (Node.js)     │
│   Port: 80/443  │    │   Port: 3002    │
└─────────────────┘    └─────────────────┘
         │                       │
         │                       │
    ┌─────────┐              ┌─────────┐
    │ Static  │              │ MongoDB │
    │ Assets  │              │ Atlas   │
    └─────────┘              └─────────┘
```

## 📚 Documentation

- **Deployment Guide**: [AWS_DEPLOYMENT_GUIDE.md](https://github.com/SanketsMane/Janashri_LMS/blob/main/AWS_DEPLOYMENT_GUIDE.md)
- **API Documentation**: Available at `/api/docs` when running
- **GitHub Repository**: [https://github.com/SanketsMane/Janashri_LMS](https://github.com/SanketsMane/Janashri_LMS)

## 🔧 Health Checks

### Backend Health
```bash
curl http://localhost:3002/api/health
```

### Frontend Health
```bash
curl http://localhost/
```

## 🚨 Troubleshooting

1. **Port Conflicts**: Ensure ports 80, 443, 3002 are available
2. **Environment Variables**: Check .env.production file
3. **Database Connection**: Verify MongoDB URI
4. **CORS Issues**: Update ALLOWED_ORIGINS with your domain/IP
5. **Memory Issues**: Ensure at least 4GB RAM available

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/SanketsMane/Janashri_LMS/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SanketsMane/Janashri_LMS/discussions)

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for Educational Excellence**