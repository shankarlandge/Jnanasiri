import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Admission from './models/Admission.js';
import Contact from './models/Contact.js';
import Gallery from './models/Gallery.js';
import Notification from './models/Notification.js';

dotenv.config();

const clearDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');

    // Get collection stats before clearing
    console.log('\n📊 Database Statistics Before Clearing:');
    const userCount = await User.countDocuments();
    const admissionCount = await Admission.countDocuments();
    const contactCount = await Contact.countDocuments();
    const galleryCount = await Gallery.countDocuments();
    const notificationCount = await Notification.countDocuments();
    
    console.log(`- Users: ${userCount}`);
    console.log(`- Admissions: ${admissionCount}`);
    console.log(`- Contacts: ${contactCount}`);
    console.log(`- Gallery Items: ${galleryCount}`);
    console.log(`- Notifications: ${notificationCount}`);
    console.log(`- Total Records: ${userCount + admissionCount + contactCount + galleryCount + notificationCount}`);

    // Ask for confirmation
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askConfirmation = () => {
      return new Promise((resolve) => {
        rl.question('\n⚠️  Are you sure you want to clear ALL data? This action cannot be undone! (yes/no): ', (answer) => {
          resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
        });
      });
    };

    const confirmed = await askConfirmation();
    rl.close();

    if (!confirmed) {
      console.log('❌ Database clearing cancelled by user');
      process.exit(0);
    }

    console.log('\n🗑️  Starting database cleanup...');

    // Clear all collections
    const collections = [
      { model: User, name: 'Users' },
      { model: Admission, name: 'Admissions' },
      { model: Contact, name: 'Contacts' },
      { model: Gallery, name: 'Gallery Items' },
      { model: Notification, name: 'Notifications' }
    ];

    let totalDeleted = 0;

    for (const { model, name } of collections) {
      const deleted = await model.deleteMany({});
      console.log(`✅ Cleared ${deleted.deletedCount} ${name}`);
      totalDeleted += deleted.deletedCount;
    }

    console.log('\n🎉 Database cleanup completed successfully!');
    console.log(`📊 Total records deleted: ${totalDeleted}`);

    // Verify cleanup
    console.log('\n🔍 Verification - Remaining records:');
    for (const { model, name } of collections) {
      const count = await model.countDocuments();
      console.log(`- ${name}: ${count}`);
    }

    console.log('\n✨ Database is now clean and ready for deployment!');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
    process.exit(0);
  }
};

// Handle process interruption
process.on('SIGINT', async () => {
  console.log('\n⚠️  Process interrupted by user');
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
  process.exit(0);
});

console.log('🚀 LMS Database Cleaner');
console.log('=======================');
clearDatabase();