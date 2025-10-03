import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('👤 Creating Test Student User...\n');

// Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI);
console.log('✅ Connected to MongoDB');

// Define User schema (simplified version)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['student', 'admin'] },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Create a test student
const testStudentData = {
  name: 'Test Student',
  email: 'teststudent@example.com',  // Use your actual email here for testing
  password: await bcrypt.hash('TestPassword123!', 12),
  role: 'student',
  isActive: true
};

try {
  // Check if user already exists
  const existingUser = await User.findOne({ email: testStudentData.email });
  
  if (existingUser) {
    console.log('⚠️  Test student already exists:', testStudentData.email);
    console.log('   You can use this email to test forgot password functionality');
  } else {
    // Create the test student
    const newUser = new User(testStudentData);
    await newUser.save();
    console.log('✅ Test student created successfully!');
  }
  
  console.log('\n📋 Test Student Details:');
  console.log('- Name:', testStudentData.name);
  console.log('- Email:', testStudentData.email);
  console.log('- Role:', testStudentData.role);
  console.log('- Active:', testStudentData.isActive);
  console.log('- Password: TestPassword123!');
  
  console.log('\n🧪 How to test forgot password:');
  console.log('1. Go to forgot password page');
  console.log('2. Select "Student" as user type');
  console.log('3. Enter email:', testStudentData.email);
  console.log('4. Check your email for OTP');
  console.log('5. Follow the reset flow');
  
  console.log('\n📧 Alternative test emails you can create:');
  console.log('- Use your actual Gmail address');
  console.log('- admin@janashiri.edu (already exists as admin)');
  console.log('- Create more test users as needed');
  
} catch (error) {
  console.error('❌ Error creating test student:', error.message);
}

mongoose.disconnect();
console.log('\n✨ Done! Database connection closed.');
process.exit(0);