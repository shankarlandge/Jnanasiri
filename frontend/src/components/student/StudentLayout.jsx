import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StudentTopNavbar from './TopNavbar';
import StudentSidebar from './Sidebar';

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StudentSidebar
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleSidebarCollapse}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <StudentTopNavbar 
          onSidebarToggle={handleSidebarToggle} 
          onSidebarCollapse={handleSidebarCollapse}
          isCollapsed={sidebarCollapsed}
        />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
