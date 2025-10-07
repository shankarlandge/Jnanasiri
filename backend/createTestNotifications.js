import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from './models/Notification.js';

dotenv.config();

const createTestNotifications = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing test notifications
    await Notification.deleteMany({ type: { $in: ['system', 'security', 'contact', 'admission'] } });
    console.log('Cleared existing test notifications');

    // Create test notifications
    const testNotifications = [
      {
        type: 'admission',
        title: 'New Admission Application',
        message: 'A new student admission application has been submitted by John Doe. Please review and take appropriate action.',
        priority: 'medium',
        read: false,
        metadata: {
          studentName: 'John Doe',
          applicationId: 'APP-001',
          course: 'Computer Science'
        }
      },
      {
        type: 'system',
        title: 'System Update Completed',
        message: 'The LMS system has been successfully updated to version 2.1. New features and security improvements are now available.',
        priority: 'low',
        read: true,
        metadata: {
          version: '2.1',
          updateTime: new Date().toISOString()
        }
      },
      {
        type: 'security',
        title: 'Multiple Failed Login Attempts',
        message: 'Security alert: Multiple failed login attempts detected from IP address 192.168.1.100. Please investigate immediately.',
        priority: 'high',
        read: false,
        metadata: {
          ipAddress: '192.168.1.100',
          attemptCount: 5,
          timeWindow: '10 minutes'
        }
      },
      {
        type: 'contact',
        title: 'New Contact Inquiry',
        message: 'A new contact form submission has been received from Sarah Wilson regarding course information.',
        priority: 'medium',
        read: false,
        metadata: {
          contactName: 'Sarah Wilson',
          email: 'sarah@email.com',
          subject: 'Course Information'
        }
      },
      {
        type: 'admission',
        title: 'Admission Approved',
        message: 'Student admission application for Mike Johnson has been approved. Welcome message sent automatically.',
        priority: 'medium',
        read: true,
        metadata: {
          studentName: 'Mike Johnson',
          applicationId: 'APP-002',
          course: 'Business Administration'
        }
      },
      {
        type: 'system',
        title: 'Database Backup Completed',
        message: 'Daily database backup has been completed successfully. All student and course data is safely backed up.',
        priority: 'low',
        read: true,
        metadata: {
          backupSize: '2.5 GB',
          backupLocation: 'AWS S3',
          completedAt: new Date().toISOString()
        }
      },
      {
        type: 'contact',
        title: 'Urgent Support Request',
        message: 'High priority support ticket received: Student unable to access course materials. Immediate attention required.',
        priority: 'high',
        read: false,
        metadata: {
          ticketId: 'TKT-001',
          studentId: 'STU-123',
          issueType: 'Access Problem'
        }
      },
      {
        type: 'admission',
        title: 'Application Deadline Reminder',
        message: 'Reminder: Spring semester admission deadline is approaching in 7 days. 15 pending applications need review.',
        priority: 'medium',
        read: false,
        metadata: {
          deadline: '2025-01-15',
          pendingCount: 15,
          semester: 'Spring 2025'
        }
      }
    ];

    // Insert test notifications
    for (const notification of testNotifications) {
      await Notification.create(notification);
    }

    console.log(`✅ Created ${testNotifications.length} test notifications successfully!`);
    
    // Display summary
    const totalNotifications = await Notification.countDocuments();
    const unreadNotifications = await Notification.countDocuments({ read: false });
    const highPriorityNotifications = await Notification.countDocuments({ priority: 'high' });
    
    console.log(`📊 Notification Statistics:`);
    console.log(`   Total: ${totalNotifications}`);
    console.log(`   Unread: ${unreadNotifications}`);
    console.log(`   High Priority: ${highPriorityNotifications}`);
    
  } catch (error) {
    console.error('❌ Error creating test notifications:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createTestNotifications();
