# 🚀 Janashiri LMS Deployment Guide

This guide will help you deploy the Janashiri Learning Management System to production.

## 📋 Pre-Deployment Checklist

### 1. Database Preparation
```bash
# Navigate to backend directory
cd backend

# Clear all development data
npm run clear-database

# Set up production environment
npm run setup-production
```

### 2. Environment Configuration

Copy the production environment template:
```bash
cp env.production.example .env
```

Update `.env` with your production values:
- MongoDB Atlas connection string
- Gmail SMTP credentials
- Cloudinary API keys
- JWT secret (minimum 32 characters)
- Production domain URLs

### 3. Security Configuration

#### Required Environment Variables:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secure_32_char_secret
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Full-Stack)

#### Backend Deployment (Vercel Functions):
1. Install Vercel CLI: `npm i -g vercel`
2. Configure `vercel.json` (already included)
3. Deploy: `vercel --prod`

#### Frontend Deployment:
```bash
cd frontend
npm run build
vercel --prod
```

### Option 2: Railway (Backend) + Vercel (Frontend)

#### Railway Backend:
1. Connect GitHub repo to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically from main branch

#### Vercel Frontend:
1. Connect GitHub repo to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`

### Option 3: Render (Full-Stack)

#### Backend (Render Web Service):
1. Connect GitHub repo
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables

#### Frontend (Render Static Site):
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## 🔧 Production Configuration

### Backend Security Enhancements

Update `server.js` for production:

```javascript
// Enable rate limiting in production
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  skip: (req) => req.method === 'OPTIONS',
  message: 'Too many requests, please try again later.'
});

if (process.env.NODE_ENV === 'production') {
  app.use(limiter);
}

// Production CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [process.env.FRONTEND_URL];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

### Frontend Build Configuration

Ensure `vite.config.js` has production settings:

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  },
  server: {
    port: 5173
  }
})
```

## 📧 Email Configuration

### Gmail Setup:
1. Enable 2-factor authentication
2. Generate App Password
3. Use App Password in EMAIL_PASS

### Custom SMTP:
Update EMAIL_HOST, EMAIL_PORT as needed

## 📁 File Upload Configuration

### Cloudinary Setup:
1. Create account at cloudinary.com
2. Get cloud name, API key, and secret
3. Configure upload presets if needed

## 🔐 Database Security

### MongoDB Atlas:
1. Whitelist deployment server IPs
2. Use strong database password
3. Enable database encryption
4. Set up automatic backups

## 🚦 Health Monitoring

### Endpoints for monitoring:
- `GET /api/health` - Server health check
- `GET /api/notifications/test` - CORS test

### Recommended Monitoring:
- Uptime monitoring (Pingdom, UptimeRobot)
- Error tracking (Sentry)
- Performance monitoring (New Relic)

## 🔄 Continuous Deployment

### GitHub Actions (Example):

```yaml
name: Deploy LMS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Production
        run: # Your deployment commands
```

## 📊 Post-Deployment Verification

### 1. Test Core Functionality:
- [ ] Admin login with default credentials
- [ ] Student registration flow
- [ ] Email notifications (OTP, admissions)
- [ ] File uploads (profile photos, documents)
- [ ] Forgot password flow

### 2. Performance Checks:
- [ ] API response times < 2s
- [ ] Frontend load times < 3s
- [ ] Image uploads working
- [ ] Email delivery working

### 3. Security Verification:
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] No sensitive data in logs

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors**: Update ALLOWED_ORIGINS in environment
2. **Database Connection**: Check MongoDB Atlas IP whitelist
3. **Email Not Sending**: Verify Gmail App Password
4. **File Uploads Failing**: Check Cloudinary credentials
5. **JWT Errors**: Ensure JWT_SECRET is set and consistent

### Debug Commands:
```bash
# Check server health
curl https://your-api-domain.com/api/health

# Test CORS
curl -H "Origin: https://your-frontend-domain.com" \
     https://your-api-domain.com/api/notifications/test

# Check database connection
node -e "require('./clearDatabase.js')" --dry-run
```

## 📞 Support

For deployment issues:
1. Check server logs
2. Verify environment variables
3. Test individual components
4. Contact system administrator

---

✨ **Congratulations!** Your Janashiri LMS is now ready for production deployment!
