import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  PhoneIcon,
  ChartBarIcon,
  BookOpenIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  PhotoIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AcademicCapIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: HomeIcon,
      badge: null
    },
    {
      title: 'Admissions',
      path: '/admin/admissions',
      icon: ClipboardDocumentListIcon,
      badge: null
    },
    {
      title: 'Students',
      path: '/admin/students',
      icon: UserGroupIcon,
      badge: null
    },
    {
      title: 'Courses',
      path: '/admin/courses',
      icon: AcademicCapIcon,
      badge: null
    },
    {
      title: 'Library',
      path: '/admin/library',
      icon: BuildingLibraryIcon,
      badge: null
    },
    {
      title: 'Exams',
      path: '/admin/exams',
      icon: DocumentTextIcon,
      badge: null
    },
    {
      title: 'Gallery',
      path: '/admin/gallery',
      icon: PhotoIcon,
      badge: null
    },
    {
      title: 'Contacts',
      path: '/admin/contacts',
      icon: PhoneIcon,
      badge: null
    },
    {
      title: 'Analytics',
      path: '/admin/analytics',
      icon: ChartBarIcon,
      badge: null
    },
    {
      title: 'Help & Support',
      path: '/admin/help',
      icon: QuestionMarkCircleIcon,
      badge: null
    }
  ];

  const bottomMenuItems = [
    {
      title: 'Notifications',
      path: '/admin/notifications',
      icon: BellIcon,
      badge: null
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: Cog6ToothIcon,
      badge: null
    }
  ];

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path || 
           (path !== '/admin/dashboard' && location.pathname.startsWith(path));
  };

  return (
    <div className={`${
      isCollapsed ? 'w-16' : 'w-64'
    } transition-all duration-300 bg-white border-r border-neutral-200 flex flex-col h-full shadow-sm`}>
      
      {/* Logo Section */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Jnana Siri</h2>
                <p className="text-xs text-neutral-500">Admin Panel</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-5 h-5 text-neutral-600" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5 text-neutral-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-600/25'
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <Icon className={`flex-shrink-0 w-5 h-5 ${
                  active ? 'text-white' : 'text-neutral-500 group-hover:text-primary-600'
                }`} />
                
                {!isCollapsed && (
                  <>
                    <span className="ml-3 flex-1">{item.title}</span>
                    {item.badge && (
                      <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full ${
                        active 
                          ? 'bg-white/20 text-white' 
                          : 'bg-primary-100 text-primary-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                
                {isCollapsed && item.badge && (
                  <span className="absolute left-8 top-1 w-2 h-2 bg-primary-600 rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-neutral-200">
        {/* Bottom Menu Items */}
        <nav className="px-2 py-4 space-y-1">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-600/25'
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <Icon className={`flex-shrink-0 w-5 h-5 ${
                  active ? 'text-white' : 'text-neutral-500 group-hover:text-primary-600'
                }`} />
                
                {!isCollapsed && (
                  <>
                    <span className="ml-3 flex-1">{item.title}</span>
                    {item.badge && (
                      <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full ${
                        active 
                          ? 'bg-white/20 text-white' 
                          : 'bg-primary-100 text-primary-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                
                {isCollapsed && item.badge && (
                  <span className="absolute left-8 top-1 w-2 h-2 bg-primary-600 rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-2 pb-4">
          <button
            onClick={handleLogout}
            className="group w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-700 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <ArrowLeftOnRectangleIcon className="flex-shrink-0 w-5 h-5 text-red-500 group-hover:text-red-600" />
            {!isCollapsed && (
              <span className="ml-3">Logout</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
