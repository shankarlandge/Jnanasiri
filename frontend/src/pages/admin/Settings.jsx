import React, { useState, useEffect } from 'react';
import {
  Cog6ToothIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CircleStackIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  CloudArrowUpIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  CameraIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    profile: {
      name: 'Administrator',
      email: 'admin@janashiri.edu',
      mobile: '+91-XXXXXXXXXX',
      profilePhoto: null,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    general: {
      siteName: 'Jnana Siri LMS',
      siteDescription: 'Learning Management System',
      adminEmail: 'admin@janasiri.edu',
      contactPhone: '+91-XXXXXXXXXX',
      address: 'Your Institution Address',
      timeZone: 'Asia/Kolkata',
      language: 'English'
    },
    security: {
      requireEmailVerification: true,
      enableTwoFactor: false,
      passwordExpiry: 90,
      maxLoginAttempts: 5,
      sessionTimeout: 24
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      admissionAlerts: true,
      systemAlerts: true,
      weeklyReports: true
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      backupFrequency: 'daily',
      logLevel: 'info',
      cacheEnabled: true
    }
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'system', name: 'System', icon: CircleStackIcon }
  ];

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleSettingChange('profile', 'profilePhoto', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-8">
      {/* Profile Photo Section */}
      <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border">
        <div className="relative">
          {settings.profile.profilePhoto ? (
            <img
              src={settings.profile.profilePhoto}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg">
              <UserIcon className="w-12 h-12 text-white" />
            </div>
          )}
          <label className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-orange-50 transition-colors">
            <CameraIcon className="w-4 h-4 text-orange-600" />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-neutral-900">Profile Photo</h3>
          <p className="text-sm text-neutral-600">Upload a professional photo</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-input"
            value={settings.profile.name}
            onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            value={settings.profile.email}
            onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
            placeholder="admin@janashiri.edu"
          />
        </div>
        <div>
          <label className="form-label">Mobile Number</label>
          <input
            type="tel"
            className="form-input"
            value={settings.profile.mobile}
            onChange={(e) => handleSettingChange('profile', 'mobile', e.target.value)}
            placeholder="+91-XXXXXXXXXX"
          />
        </div>
      </div>

      {/* Password Change Section */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border">
        <div className="flex items-center space-x-3 mb-6">
          <KeyIcon className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Change Password</h3>
            <p className="text-sm text-neutral-600">Update your login password for security</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-input"
              value={settings.profile.currentPassword}
              onChange={(e) => handleSettingChange('profile', 'currentPassword', e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-input"
              value={settings.profile.newPassword}
              onChange={(e) => handleSettingChange('profile', 'newPassword', e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              value={settings.profile.confirmPassword}
              onChange={(e) => handleSettingChange('profile', 'confirmPassword', e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
        </div>
        {settings.profile.newPassword && settings.profile.confirmPassword && 
         settings.profile.newPassword !== settings.profile.confirmPassword && (
          <div className="mt-3 flex items-center space-x-2 text-red-600">
            <ExclamationTriangleIcon className="w-4 h-4" />
            <span className="text-sm">Passwords do not match</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Site Name</label>
          <input
            type="text"
            className="form-input"
            value={settings.general.siteName}
            onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Admin Email</label>
          <input
            type="email"
            className="form-input"
            value={settings.general.adminEmail}
            onChange={(e) => handleSettingChange('general', 'adminEmail', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Contact Phone</label>
          <input
            type="tel"
            className="form-input"
            value={settings.general.contactPhone}
            onChange={(e) => handleSettingChange('general', 'contactPhone', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Time Zone</label>
          <select
            className="form-select"
            value={settings.general.timeZone}
            onChange={(e) => handleSettingChange('general', 'timeZone', e.target.value)}
          >
            <option value="Asia/Kolkata">India Standard Time</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="Europe/London">London Time</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="form-label">Site Description</label>
        <textarea
          className="form-textarea"
          rows="3"
          value={settings.general.siteDescription}
          onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
        />
      </div>
      
      <div>
        <label className="form-label">Institution Address</label>
        <textarea
          className="form-textarea"
          rows="3"
          value={settings.general.address}
          onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
        />
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Password Expiry (days)</label>
          <input
            type="number"
            className="form-input"
            value={settings.security.passwordExpiry}
            onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className="form-label">Max Login Attempts</label>
          <input
            type="number"
            className="form-input"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className="form-label">Session Timeout (hours)</label>
          <input
            type="number"
            className="form-input"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
          <div className="flex items-center space-x-3">
            <EnvelopeIcon className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-neutral-900">Email Verification</div>
              <div className="text-sm text-neutral-600">Require email verification for new accounts</div>
            </div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.security.requireEmailVerification}
              onChange={(e) => handleSettingChange('security', 'requireEmailVerification', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border">
          <div className="flex items-center space-x-3">
            <KeyIcon className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-medium text-neutral-900">Two-Factor Authentication</div>
              <div className="text-sm text-neutral-600">Enable 2FA for additional security</div>
            </div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.security.enableTwoFactor}
              onChange={(e) => handleSettingChange('security', 'enableTwoFactor', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => {
    const markAsRead = (id) => {
      setNotifications(prev => prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
    };

    const deleteNotification = (id) => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const markAllAsRead = () => {
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    };

    return (
      <div className="space-y-6">
        {/* Notification Preferences */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h4>
          {[
            {
              key: 'emailNotifications',
              title: 'Email Notifications',
              description: 'Receive notifications via email',
              icon: EnvelopeIcon,
              color: 'blue'
            },
            {
              key: 'smsNotifications',
              title: 'SMS Notifications',
              description: 'Receive notifications via SMS',
              icon: BellIcon,
              color: 'green'
            },
            {
              key: 'pushNotifications',
              title: 'Push Notifications',
              description: 'Receive browser push notifications',
              icon: GlobeAltIcon,
              color: 'purple'
            },
            {
              key: 'admissionAlerts',
              title: 'Admission Alerts',
              description: 'Get notified about new admission applications',
              icon: UserIcon,
              color: 'orange'
            },
            {
              key: 'systemAlerts',
              title: 'System Alerts',
              description: 'Receive system maintenance and error alerts',
              icon: ExclamationTriangleIcon,
              color: 'red'
            },
            {
              key: 'weeklyReports',
              title: 'Weekly Reports',
              description: 'Get weekly summary reports',
              icon: DocumentTextIcon,
              color: 'indigo'
            }
          ].map((item) => {
            const Icon = item.icon;
            const colorClasses = {
              blue: 'from-blue-50 to-blue-100 text-blue-600',
              green: 'from-green-50 to-green-100 text-green-600',
              purple: 'from-purple-50 to-purple-100 text-purple-600',
              orange: 'from-orange-50 to-orange-100 text-orange-600',
              red: 'from-red-50 to-red-100 text-red-600',
              indigo: 'from-indigo-50 to-indigo-100 text-indigo-600'
            };

            return (
              <div key={item.key} className={`flex items-center justify-between p-4 bg-gradient-to-r ${colorClasses[item.color]} rounded-lg border`}>
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${colorClasses[item.color].split(' ')[2]}`} />
                  <div>
                    <div className="font-medium text-neutral-900">{item.title}</div>
                    <div className="text-sm text-neutral-600">{item.description}</div>
                  </div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications[item.key]}
                    onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            );
          })}
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Recent Notifications</h4>
            <button 
              onClick={markAllAsRead}
              className="text-sm px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Mark all as read
            </button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div key={notification.id} className={`p-4 rounded-lg border transition-all ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200 shadow-sm'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`w-3 h-3 rounded-full mr-3 ${notification.read ? 'bg-gray-400' : 'bg-blue-500'}`}></span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full mr-3 ${
                          notification.type === 'admission' ? 'bg-green-100 text-green-800' :
                          notification.type === 'payment' ? 'bg-yellow-100 text-yellow-800' :
                          notification.type === 'support' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                        <h5 className="font-semibold text-gray-800">{notification.title}</h5>
                      </div>
                      <p className="text-sm text-gray-600 ml-6 mb-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 ml-6">{notification.time}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          Mark read
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <BellIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-medium">No notifications found</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Backup Frequency</label>
          <select
            className="form-select"
            value={settings.system.backupFrequency}
            onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="form-label">Log Level</label>
          <select
            className="form-select"
            value={settings.system.logLevel}
            onChange={(e) => handleSettingChange('system', 'logLevel', e.target.value)}
          >
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
            <div>
              <div className="font-medium text-neutral-900">Maintenance Mode</div>
              <div className="text-sm text-neutral-600">Put the system in maintenance mode</div>
            </div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.system.maintenanceMode}
              onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border">
          <div className="flex items-center space-x-3">
            <Cog6ToothIcon className="h-5 w-5 text-red-600" />
            <div>
              <div className="font-medium text-neutral-900">Debug Mode</div>
              <div className="text-sm text-neutral-600">Enable debug mode for development</div>
            </div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.system.debugMode}
              onChange={(e) => handleSettingChange('system', 'debugMode', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border">
          <div className="flex items-center space-x-3">
            <CloudArrowUpIcon className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-neutral-900">Cache Enabled</div>
              <div className="text-sm text-neutral-600">Enable caching for better performance</div>
            </div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.system.cacheEnabled}
              onChange={(e) => handleSettingChange('system', 'cacheEnabled', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg">
              <Cog6ToothIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                System Settings
              </h1>
              <p className="text-neutral-600">
                Configure system preferences and security settings
              </p>
            </div>
          </div>
          
          {saved && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircleIcon className="w-5 h-5" />
              <span className="font-medium">Settings saved successfully!</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="xl:col-span-1">
          <div className="card p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'text-neutral-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="xl:col-span-3">
          <div className="card p-8">
            {activeTab === 'profile' && renderProfileSettings()}
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'system' && renderSystemSettings()}

            <div className="flex items-center justify-end space-x-4 mt-8 pt-8 border-t border-neutral-200">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => window.location.reload()}
              >
                Reset Changes
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for toggle switches */}
      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }
        
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e1;
          transition: .4s;
          border-radius: 24px;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        input:checked + .slider {
          background: linear-gradient(to right, #f97316, #dc2626);
        }
        
        input:checked + .slider:before {
          transform: translateX(24px);
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;