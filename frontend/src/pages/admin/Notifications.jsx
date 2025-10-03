import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import {
  BellIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  ClockIcon,
  EyeIcon,
  TrashIcon,
  ArchiveBoxIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const AdminNotifications = () => {
  const { 
    notifications, 
    loading,
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    getUnreadCount,
    fetchNotifications
  } = useNotifications();
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter notifications based on type and search term
  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesSearch = !searchTerm || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'admission':
        return <UserGroupIcon className="w-5 h-5" />;
      case 'system':
        return <Cog6ToothIcon className="w-5 h-5" />;
      case 'security':
        return <ShieldCheckIcon className="w-5 h-5" />;
      case 'contact':
        return <EnvelopeIcon className="w-5 h-5" />;
      case 'course':
        return <BookOpenIcon className="w-5 h-5" />;
      default:
        return <BellIcon className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type, priority) => {
    const baseColors = {
      admission: 'from-blue-100 to-blue-200 text-blue-800',
      system: 'from-purple-100 to-purple-200 text-purple-800',
      security: 'from-red-100 to-red-200 text-red-800',
      contact: 'from-green-100 to-green-200 text-green-800',
      course: 'from-orange-100 to-orange-200 text-orange-800'
    };

    if (priority === 'high') {
      return 'from-red-100 to-red-200 text-red-800 ring-2 ring-red-200';
    }

    return baseColors[type] || 'from-gray-100 to-gray-200 text-gray-800';
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[priority]}`}>
        {priority === 'high' && <ExclamationTriangleIcon className="w-3 h-3 mr-1" />}
        {priority === 'medium' && <InformationCircleIcon className="w-3 h-3 mr-1" />}
        {priority === 'low' && <CheckCircleIcon className="w-3 h-3 mr-1" />}
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  const handleMarkAsRead = (notificationId) => {
    markAsRead(notificationId);
  };

  const handleDelete = (notificationId) => {
    deleteNotification(notificationId);
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const notificationStats = {
    total: notifications.length,
    unread: getUnreadCount(),
    high: notifications.filter(n => n.priority === 'high').length,
    recent: notifications.filter(n => new Date() - new Date(n.timestamp) < 24 * 60 * 60 * 1000).length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
              <BellIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Notifications
              </h1>
              <p className="text-neutral-600">
                Stay updated with system alerts and important information
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {getUnreadCount() > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium"
              >
                Mark all as read
              </button>
            )}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                className="form-input pl-10 w-64 bg-white/80 backdrop-blur-sm border-neutral-200 focus:border-blue-300 focus:ring-blue-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <FunnelIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <select
                className="form-select pl-10 bg-white/80 backdrop-blur-sm border-neutral-200 focus:border-blue-300 focus:ring-blue-200"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="admission">Admissions</option>
                <option value="system">System</option>
                <option value="security">Security</option>
                <option value="contact">Contacts</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Notifications', 
            value: notificationStats.total, 
            icon: BellIcon,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50'
          },
          { 
            label: 'Unread', 
            value: notificationStats.unread, 
            icon: ExclamationTriangleIcon,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50'
          },
          { 
            label: 'High Priority', 
            value: notificationStats.high, 
            icon: ExclamationTriangleIcon,
            color: 'from-red-500 to-red-600',
            bgColor: 'bg-red-50'
          },
          { 
            label: 'Recent (24h)', 
            value: notificationStats.recent, 
            icon: ClockIcon,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`card p-6 ${stat.bgColor} border-0 hover:shadow-lg transition-all duration-300`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-600">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Loading notifications...</h3>
            <p className="text-neutral-600">Please wait while we fetch your notifications.</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mb-6">
              <BellIcon className="h-12 w-12 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">No notifications found</h3>
            <p className="text-neutral-600 mb-8 max-w-sm mx-auto">
              System notifications and alerts will appear here. Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-6 hover:bg-gradient-to-r hover:from-blue-25 hover:to-indigo-25 transition-all duration-200 ${
                  !notification.read ? 'bg-gradient-to-r from-blue-50 to-blue-25' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${getNotificationColor(notification.type, notification.priority)} shadow-md`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-neutral-900">
                            {notification.title}
                          </h3>
                          {getPriorityBadge(notification.priority)}
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-neutral-600 mb-3 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-neutral-500">
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{formatDate(new Date(notification.createdAt))}</span>
                          </div>
                          <span className="capitalize">{notification.type}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleViewDetails(notification)}
                          className="p-2 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="p-2 text-neutral-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark as Read"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      {showModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${getNotificationColor(selectedNotification.type, selectedNotification.priority)} shadow-md`}>
                    {getNotificationIcon(selectedNotification.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 mb-2">
                      {selectedNotification.title}
                    </h2>
                    <div className="flex items-center space-x-3">
                      {getPriorityBadge(selectedNotification.priority)}
                      <span className="text-sm text-neutral-500 capitalize">
                        {selectedNotification.type}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Message</h3>
                <p className="text-neutral-700 leading-relaxed">
                  {selectedNotification.message}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Details</h3>
                <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-500">Created:</span>
                      <div className="font-medium text-neutral-900">
                        {new Date(selectedNotification.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500">Status:</span>
                      <div className="font-medium text-neutral-900">
                        {selectedNotification.read ? 'Read' : 'Unread'}
                      </div>
                    </div>
                    {selectedNotification.data && Object.keys(selectedNotification.data).map((key) => (
                      <div key={key}>
                        <span className="text-neutral-500 capitalize">{key}:</span>
                        <div className="font-medium text-neutral-900">
                          {selectedNotification.data[key]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-neutral-200 bg-gradient-to-r from-neutral-50 to-neutral-100">
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
                {!selectedNotification.read && (
                  <button
                    onClick={() => {
                      handleMarkAsRead(selectedNotification._id);
                      setShowModal(false);
                    }}
                    className="btn-primary"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;