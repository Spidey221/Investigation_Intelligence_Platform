import React from 'react';
import { User, Bell } from 'lucide-react';

const Topbar = ({ onCreateClick }) => {
  return (
    <div className="h-20 bg-cyber-darker border-b border-cyber-accent flex items-center justify-between px-8">
      <div>
        <h1 className="text-2xl font-bold text-cyber-text">Welcome, Agent</h1>
        <p className="text-sm text-cyber-textMuted">System status: <span className="text-green-400 font-medium">Online</span></p>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={onCreateClick}
          className="btn-primary flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Create New Case
        </button>
        
        <div className="flex items-center gap-4 text-cyber-textMuted border-l border-cyber-accent pl-6">
          <button className="hover:text-cyber-blue transition-colors relative">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyber-blue rounded-full shadow-[0_0_5px_#00f0ff]"></span>
          </button>
          <div className="w-10 h-10 bg-cyber-accent rounded-full flex items-center justify-center border border-gray-700">
            <User size={20} className="text-cyber-text" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
