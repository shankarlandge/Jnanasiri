import express from 'express';
import Notification from '../models/Notification.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all notifications for admin
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, read, priority } = req.query;
    
    // Build query
    const query = {};
    if (type && type !== 'all') query.type = type;
    if (read !== undefined) query.read = read === 'true';
    if (priority && priority !== 'all') query.priority = priority;

    // Get notifications with pagination
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('relatedId', 'name email subject')
      .lean();

    // Get total count
    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ read: false });

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          total: await Notification.countDocuments(),
          unread: unreadCount,
          read: await Notification.countDocuments({ read: true }),
          high: await Notification.countDocuments({ priority: 'high' }),
          medium: await Notification.countDocuments({ priority: 'medium' }),
          low: await Notification.countDocuments({ priority: 'low' })
        }
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
});

// Get unread notification count
router.get('/unread-count', authenticate, adminOnly, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ read: false });
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error.message
    });
  }
});

// Mark notification as read
router.patch('/:id/read', authenticate, adminOnly, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', authenticate, adminOnly, async (req, res) => {
  try {
    await Notification.updateMany(
      { read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
});

// Delete notification
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
});

// Create notification (internal use)
router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    });
  }
});

// Test endpoint for CORS verification
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'CORS is working properly!',
    timestamp: new Date().toISOString()
  });
});

export default router;