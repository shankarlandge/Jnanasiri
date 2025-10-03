import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth.js';
import admissionRoutes from './routes/admission.js';
import studentRoutes from './routes/student.js';
import adminRoutes from './routes/admin.js';
import publicRoutes from './routes/public.js';
import galleryRoutes from './routes/gallery.js';
import notificationRoutes from './routes/notifications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet());

// Rate limiting - enabled for production
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // requests per windowMs
  skip: (req) => {
    // Skip rate limiting for OPTIONS requests (CORS preflight) and in development
    return req.method === 'OPTIONS' || process.env.NODE_ENV === 'development';
  },
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting only in production
if (process.env.NODE_ENV === 'production') {
  app.use(limiter);
  console.log('✅ Rate limiting enabled for production');
}

// CORS configuration - environment-aware setup
const getAllowedOrigins = () => {
  const developmentOrigins = [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177'
  ];
  
  const productionOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [];

  const frontendUrl = process.env.FRONTEND_URL;
  if (frontendUrl) {
    productionOrigins.push(frontendUrl);
  }

  return process.env.NODE_ENV === 'production' 
    ? [...new Set(productionOrigins)] // Remove duplicates
    : [...developmentOrigins, ...productionOrigins].filter(Boolean);
};

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    const allowedOrigins = getAllowedOrigins();
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    console.warn(`🚫 CORS blocked origin: ${origin}`);
    callback(new Error(`Origin ${origin} not allowed by CORS policy`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type', 
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ],
  exposedHeaders: ['Content-Length', 'X-Access-Token'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}));

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Cache-Control,X-Access-Token');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  res.sendStatus(200);
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admission', admissionRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'LMS Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test CORS endpoint
app.get('/api/notifications/test', (req, res) => {
  res.json({
    success: true,
    message: 'CORS is working properly!',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    console.warn('Server will continue without database connection for testing...');
    return false;
  }
};

// Start server
const startServer = async () => {
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.warn('Warning: Database not connected. Some features may not work.');
  }
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

export default app;
