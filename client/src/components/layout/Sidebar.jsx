import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Settings, LogOut, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Cases', path: '/cases', icon: Briefcase },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-cyber-darker border-r border-cyber-accent flex flex-col text-cyber-textMuted">
      <div className="p-6 flex items-center gap-3 text-cyber-blue font-bold text-xl tracking-wider">
        <ShieldAlert size={28} className="drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
        <span>IIP CORE</span>
      </div>
      
      <nav className="flex-1 px-4 mt-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-4 py-3 rounded-md transition-all",
              isActive 
                ? "bg-cyber-accent text-cyber-blue border-l-2 border-cyber-blue" 
                : "hover:bg-cyber-card hover:text-cyber-text"
            )}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-cyber-accent">
        <NavLink to="/login" className="flex items-center gap-3 px-4 py-3 rounded-md transition-all hover:bg-cyber-card hover:text-red-400">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
