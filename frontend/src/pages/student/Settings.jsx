import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  UserCircleIcon,
  DevicePhoneMobileIcon,
  SwatchIcon,
  LanguageIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    theme: 'light',
    language: 'english',
    twoFactorAuth: false
  });

  const tabs = [
    { id: 'account', name: 'Account', icon: UserCircleIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'preferences', name: 'Preferences', icon: CogIcon }
  ];

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      // API call would go here
      console.log('Password change request:', { 
        currentPassword: passwordForm.currentPassword, 
        newPassword: passwordForm.newPassword 
      });
      setSuccess('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = async (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    // API call would go here
    console.log('Preference updated:', { [key]: value });
  };

  const handleLogoutAllDevices = async () => {
    if (window.confirm('Are you sure you want to log out from all devices?')) {
      setLoading(true);
      try {
        // API call would go here
        console.log('Logout from all devices');
        logout();
      } catch (err) {
        setError('Failed to logout from all devices');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <p className="text-gray-900 font-medium">{user?.name || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <p className="text-gray-900 font-medium">{user?.email || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
            <p className="text-blue-600 font-semibold">{user?.student_id || 'Not assigned'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
            <p className="text-gray-900 font-medium">{user?.mobile || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class/Standard</label>
            <p className="text-gray-900 font-medium">{user?.standard || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              user?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {user?.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-600 mb-4">
            To update your personal information, please contact the administration or update it in your Profile section.
          </p>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <KeyIcon className="w-5 h-5 mr-2 text-blue-500" />
          Change Password
        </h3>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
            <XMarkIcon className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
            <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4"
              >
                {showCurrentPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4"
              >
                {showNewPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Security Options */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Options</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add extra security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.twoFactorAuth}
                onChange={(e) => handlePreferenceChange('twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">Logout All Devices</h4>
              <p className="text-sm text-gray-600">Sign out from all devices except this one</p>
            </div>
            <button
              onClick={handleLogoutAllDevices}
              disabled={loading}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              Logout All
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BellIcon className="w-5 h-5 mr-2 text-purple-500" />
          Notification Preferences
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BellIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DevicePhoneMobileIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications via SMS</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.smsNotifications}
                onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BellIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Push Notifications</h4>
                <p className="text-sm text-gray-600">Receive push notifications in browser</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.pushNotifications}
                onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <SwatchIcon className="w-5 h-5 mr-2 text-indigo-500" />
          Display Preferences
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handlePreferenceChange('theme', 'light')}
                className={`p-4 border-2 rounded-xl text-left transition-colors ${
                  preferences.theme === 'light'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white border border-gray-300 rounded"></div>
                  <span className="font-medium">Light</span>
                </div>
              </button>
              <button
                onClick={() => handlePreferenceChange('theme', 'dark')}
                className={`p-4 border-2 rounded-xl text-left transition-colors ${
                  preferences.theme === 'dark'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-800 rounded"></div>
                  <span className="font-medium">Dark</span>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="marathi">Marathi</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <CogIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-purple-100 mt-2">Manage your account preferences and security</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'account' && renderAccountTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'preferences' && renderPreferencesTab()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
