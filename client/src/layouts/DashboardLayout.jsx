import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-cyber-dark overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-cyber-dark">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
