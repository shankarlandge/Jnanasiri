import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopNavbar from './AdminTopNavbar';

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full z-40">
        <AdminSidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      } transition-all duration-300`}>
        
        {/* Top Navigation */}
        <div className="sticky top-0 z-30">
          <AdminTopNavbar isCollapsed={isSidebarCollapsed} />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
