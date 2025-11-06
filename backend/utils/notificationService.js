import Notification from '../models/Notification.js';

class NotificationService {
  static async createNotification(data) {
    try {
      const notification = new Notification(data);
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  static async createAdmissionNotification(admission) {
    return this.createNotification({
      type: 'admission',
      title: 'New Admission Application',
      message: `${admission.firstName} ${admission.lastName} has submitted a new admission application for ${admission.course}.`,
      priority: 'high',
      relatedId: admission._id,
      relatedModel: 'Admission',
      actionUrl: '/admin/admissions',
      metadata: {
        applicantName: `${admission.firstName} ${admission.lastName}`,
        course: admission.course,
        email: admission.email,
        phone: admission.phone
      }
    });
  }

  static async createContactNotification(contact) {
    return this.createNotification({
      type: 'contact',
      title: 'New Contact Inquiry',
      message: `${contact.name} has submitted a contact form inquiry: "${contact.subject}".`,
      priority: 'medium',
      relatedId: contact._id,
      relatedModel: 'Contact',
      actionUrl: '/admin/contacts',
      metadata: {
        contactName: contact.name,
        email: contact.email,
        subject: contact.subject,
        phone: contact.phone
      }
    });
  }

  static async createSystemNotification(title, message, priority = 'low') {
    return this.createNotification({
      type: 'system',
      title,
      message,
      priority,
      actionUrl: '/admin/settings',
      metadata: {
        source: 'system',
        timestamp: new Date()
      }
    });
  }

  static async createSecurityNotification(title, message, metadata = {}) {
    return this.createNotification({
      type: 'security',
      title,
      message,
      priority: 'high',
      actionUrl: '/admin/settings',
      metadata: {
        source: 'security',
        ...metadata
      }
    });
  }

  static async markAsRead(notificationId) {
    try {
      return await Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  static async markAllAsRead() {
    try {
      return await Notification.updateMany(
        { read: false },
        { read: true }
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  static async deleteNotification(notificationId) {
    try {
      return await Notification.findByIdAndDelete(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  static async getUnreadCount() {
    try {
      return await Notification.countDocuments({ read: false });
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  static async getNotifications(query = {}, options = {}) {
    try {
      const { page = 1, limit = 20, sort = { createdAt: -1 } } = options;
      
      const notifications = await Notification.find(query)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('relatedId')
        .lean();

      const total = await Notification.countDocuments(query);

      return {
        notifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  }
}

export default NotificationService;