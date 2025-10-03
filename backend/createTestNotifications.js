import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NotificationService from './utils/notificationService.js';

dotenv.config();

async function createTestNotifications() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create test notifications
    const notifications = [
      {
        type: 'admission',
        title: 'New Admission Application',
        message: 'Priya Sharma has submitted a new admission application for B.Tech Computer Science.',
        priority: 'high'
      },
      {
        type: 'contact', 
        title: 'Contact Form Inquiry',
        message: 'Rajesh Kumar has sent a message through the contact form asking about course fees.',
        priority: 'medium'
      },
      {
        type: 'system',
        title: 'Database Backup Completed',
        message: 'Daily database backup has been completed successfully at 2:00 AM.',
        priority: 'low'
      }
    ];

    for (const notifData of notifications) {
      await NotificationService.createNotification(notifData);
      console.log(`Created notification: ${notifData.title}`);
    }

    console.log('Test notifications created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test notifications:', error);
    process.exit(1);
  }
}

createTestNotifications();