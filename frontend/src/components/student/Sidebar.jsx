import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserIcon,
  IdentificationIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
  QuestionMarkCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const StudentSidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon },
    { name: 'My Profile', href: '/student/profile', icon: UserIcon },
    { name: 'ID Card', href: '/student/id-card', icon: IdentificationIcon },
    { name: 'Courses', href: '/student/courses', icon: BookOpenIcon },
    { name: 'Library', href: '/student/library', icon: BuildingLibraryIcon },
    { name: 'Exams', href: '/student/exams', icon: AcademicCapIcon },
    { name: 'Help', href: '/student/help', icon: QuestionMarkCircleIcon },
    { name: 'Settings', href: '/student/settings', icon: Cog6ToothIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-16' : 'w-64'} flex-shrink-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center p-4 border-b border-gray-200 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <img
                  src="/jnana-siri-logo.png"
                  alt="Jnana Siri"
                  className="w-8 h-8"
                />
                <span className="text-lg font-semibold text-gray-900">
                  Student Portal
                </span>
              </div>
            )}
            
            {isCollapsed && (
              <img
                src="/jnana-siri-logo.png"
                alt="Jnana Siri"
                className="w-8 h-8"
              />
            )}
            
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 lg:hidden"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              {user?.photo?.url ? (
                <img
                  src={user.photo.url}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                  title={isCollapsed ? user?.name : ''}
                />
              ) : (
                <div 
                  className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center"
                  title={isCollapsed ? user?.name : ''}
                >
                  <span className="text-white font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || 'S'}
                  </span>
                </div>
              )}
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || 'Student'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    ID: {user?.student_id || 'N/A'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    active
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.name : ''}
                >
                  <Icon
                    className={`flex-shrink-0 w-6 h-6 ${
                      active ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    } ${isCollapsed ? '' : 'mr-3'}`}
                  />
                  {!isCollapsed && item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default StudentSidebar;
