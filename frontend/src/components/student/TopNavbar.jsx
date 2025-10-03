import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bars3Icon, UserCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const StudentTopNavbar = ({ onSidebarToggle, onSidebarCollapse, isCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/profile')) return 'My Profile';
    if (path.includes('/id-card')) return 'ID Card';
    if (path.includes('/settings')) return 'Settings';
    return 'Student Portal';
  };

  return (
    <nav className="bg-white border-b border-gray-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onSidebarToggle}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <button
              onClick={onSidebarCollapse}
              className="hidden lg:block p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-5 h-5" />
              ) : (
                <ChevronLeftIcon className="w-5 h-5" />
              )}
            </button>
            
            <div className="block">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
            >
              {user?.photo?.url ? (
                <img
                  src={user.photo.url}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'S'}
                  </span>
                </div>
              )}
              <span className="hidden sm:block font-medium text-gray-700">
                {user?.name || 'Student'}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border py-1 z-50">
                <Link
                  to="/student/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/student/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
};

export default StudentTopNavbar;
