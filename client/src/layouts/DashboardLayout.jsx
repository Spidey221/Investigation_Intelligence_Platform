import React, { useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { LayoutDashboard, FolderKanban, Settings, LogOut, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const DashboardLayout = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Cases', href: '/cases', icon: FolderKanban },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-cyber-dark overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-cyber-border flex items-center justify-between px-6">
          <div className="text-cyber-accent font-bold">
            Welcome, {user?.name || 'User'}
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-cyber-gray hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-cyber-dark">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
