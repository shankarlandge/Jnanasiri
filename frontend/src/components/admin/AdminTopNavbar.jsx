import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const AdminTopNavbar = ({ isCollapsed }) => {
  const { user, logout } = useAuth();
  const { getUnreadCount } = useNotifications();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        
        {/* Dynamic Greeting & Time */}
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            <h1 className="text-2xl font-bold">
              {getTimeBasedGreeting()}, {user?.name?.split(' ')[0] || 'Admin'}!
            </h1>
            <p className="text-sm text-gray-600">
              {getCurrentTime()} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          
          {/* Enhanced Notifications */}
          <div className="relative">
            <button 
              onClick={() => navigate('/admin/notifications')}
              className="p-2.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all relative"
              title="Notifications"
            >
              <BellIcon className="w-5 h-5" />
              {getUnreadCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {getUnreadCount()}
                </span>
              )}
            </button>
          </div>

          {/* Settings */}
          <button 
            onClick={() => navigate('/admin/settings')}
            className="p-2.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
            title="Settings"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>

          {/* Enhanced User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-r-xl py-2 pr-3 transition-all"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-xs text-gray-600">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Super Admin'}
                </p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user?.name || 'Administrator'}</p>
                      <p className="text-sm text-gray-600">{user?.email || 'admin@janashiri.edu'}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Online • {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Super Admin'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate('/admin/settings');
                      setShowUserDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 mr-3" />
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      navigate('/admin/settings');
                      setShowUserDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Cog6ToothIcon className="w-4 h-4 mr-3" />
                    Account Settings
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowUserDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default AdminTopNavbar;
