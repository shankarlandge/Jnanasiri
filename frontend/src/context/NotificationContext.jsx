import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationAPI } from '../utils/api';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getNotifications();
      // Handle different response structures
      if (response.data) {
        if (response.data.notifications) {
          setNotifications(response.data.notifications);
        } else if (Array.isArray(response.data)) {
          setNotifications(response.data);
        } else {
          setNotifications([]);
        }
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Don't throw or cause further issues - just set empty array
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize notifications on component mount
  useEffect(() => {
    // Only fetch if we have a token (authenticated)
    const token = localStorage.getItem('token');
    if (token) {
      fetchNotifications();
      
      // Set up polling for real-time updates every 30 seconds
      const interval = setInterval(() => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
          fetchNotifications();
        }
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, []);

  const addNotification = async (notification) => {
    try {
      const response = await notificationAPI.createNotification(notification);
      if (response.success) {
        // Refresh notifications to get the latest data
        await fetchNotifications();
      }
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      // Update local state regardless of response structure
      setNotifications(prev => prev.map(notif => 
        notif._id === id ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      // Update local state regardless of response structure
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationAPI.deleteNotification(id);
      // Update local state regardless of response structure
      setNotifications(prev => prev.filter(notif => notif._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const getRecentNotifications = (limit = 5) => {
    return notifications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  const value = {
    notifications,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
    getRecentNotifications,
    fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;