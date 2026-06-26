import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-4">
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-8 max-w-md w-full text-center">
        <ShieldAlert className="w-16 h-16 text-cyber-red mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-cyber-text mb-2">Access Denied</h1>
        <p className="text-cyber-muted mb-6">
          You do not have the required permissions to access this resource. If you believe this is an error, please contact your System Administrator.
        </p>
        <Link to="/dashboard" className="bg-cyber-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
