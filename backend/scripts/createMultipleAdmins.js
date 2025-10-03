import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createMultipleAdmins = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Define admin users to create
    const adminUsers = [
      {
        email: 'contactsanket1@gmail.com',
        password: 'Sanket@3030',
        name: 'Sanket Admin',
        role: 'admin',
        isActive: true
      },
      {
        email: 'jnanasiriinstitute@gmail.com',
        password: 'Jnanasiri@123456',
        name: 'Jnanasiri Institute Admin',
        role: 'admin',
        isActive: true
      }
    ];
    
    console.log('Creating admin users...\n');
    
    for (const adminData of adminUsers) {
      try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        
        if (existingAdmin) {
          console.log(`Admin already exists: ${adminData.email}`);
          console.log(`Updating password for: ${adminData.email}`);
          
          // Update existing admin
          existingAdmin.password = adminData.password;
          existingAdmin.role = 'admin';
          existingAdmin.isActive = true;
          if (adminData.name) existingAdmin.name = adminData.name;
          
          await existingAdmin.save();
          console.log(`✅ Updated admin: ${adminData.email}\n`);
        } else {
          // Create new admin user
          const admin = new User(adminData);
          await admin.save();
          
          console.log(`✅ Created new admin: ${adminData.email}`);
          console.log(`   Password: ${adminData.password}`);
          console.log(`   Role: ${admin.role}\n`);
        }
        
      } catch (userError) {
        console.error(`❌ Error with admin ${adminData.email}:`, userError.message);
      }
    }
    
    console.log('✅ Admin creation process completed!');
    console.log('\n📋 Final Admin List:');
    
    const allAdmins = await User.find({ role: 'admin' }).select('email name role isActive');
    allAdmins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.email} (${admin.name || 'No name'}) - Active: ${admin.isActive}`);
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creating admin users:', error);
    process.exit(1);
  }
};

createMultipleAdmins();