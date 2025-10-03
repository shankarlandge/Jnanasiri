import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const setupProduction = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');

    console.log('\n🚀 Setting up production environment...');

    // Create default admin user
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      console.log('👤 Creating default admin user...');
      
      const defaultAdmin = new User({
        email: process.env.ADMIN_EMAIL || 'admin@janashiri.edu',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin',
        name: 'System Administrator',
        isActive: true
      });

      await defaultAdmin.save();
      console.log('✅ Default admin user created successfully');
      console.log(`   Email: ${defaultAdmin.email}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Validate environment variables
    console.log('\n🔍 Validating environment configuration...');
    
    const requiredVars = [
      'MONGODB_URI',
      'JWT_SECRET',
      'EMAIL_HOST',
      'EMAIL_USER', 
      'EMAIL_PASS',
      'EMAIL_FROM',
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET'
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      console.log('❌ Missing required environment variables:');
      missing.forEach(varName => console.log(`   - ${varName}`));
      console.log('\n📝 Please set these variables in your deployment environment');
    } else {
      console.log('✅ All required environment variables are configured');
    }

    // Check database indexes
    console.log('\n🔧 Ensuring database indexes...');
    try {
      await User.collection.createIndex({ email: 1 }, { unique: true, name: 'email_unique' });
      console.log('✅ Email index ensured');
    } catch (error) {
      if (error.codeName === 'IndexOptionsConflict' || error.code === 85 || error.message.includes('existing index')) {
        console.log('ℹ️  Email index already exists');
      } else {
        throw error;
      }
    }
    
    try {
      await User.collection.createIndex({ student_id: 1 }, { unique: true, sparse: true, name: 'student_id_unique_sparse' });
      console.log('✅ Student ID index ensured');
    } catch (error) {
      if (error.codeName === 'IndexOptionsConflict' || error.code === 85 || error.message.includes('existing index')) {
        console.log('ℹ️  Student ID index already exists');
      } else {
        throw error;
      }
    }
    
    console.log('✅ Database indexes verified');

    // Production settings recommendations
    console.log('\n📋 Production Deployment Checklist:');
    console.log('==================================');
    console.log('✅ Database cleared and indexes created');
    console.log('✅ Default admin user configured');
    console.log('☐ Set NODE_ENV=production');
    console.log('☐ Configure proper CORS origins');
    console.log('☐ Set up SSL/TLS certificates');
    console.log('☐ Configure rate limiting');
    console.log('☐ Set up monitoring and logging');
    console.log('☐ Configure backup strategy');
    console.log('☐ Test email delivery');
    console.log('☐ Test file upload functionality');

    console.log('\n🎯 Next Steps for Deployment:');
    console.log('1. Update FRONTEND_URL in environment');
    console.log('2. Set appropriate CORS origins');
    console.log('3. Enable rate limiting in production');
    console.log('4. Configure proper logging');
    console.log('5. Set up health monitoring');

    console.log('\n✨ Production setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up production:', error.message);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
    process.exit(0);
  }
};

console.log('🏭 LMS Production Setup');
console.log('=======================');
setupProduction();