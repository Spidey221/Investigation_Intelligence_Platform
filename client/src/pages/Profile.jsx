import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Shield, Mail, Calendar, Activity } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cyber-text">User Profile</h1>
        <p className="text-cyber-muted">Manage your account and view activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-cyber-card border border-cyber-border rounded-lg p-6 flex flex-col items-center">
            <div className="w-24 h-24 bg-cyber-dark border-2 border-cyber-blue rounded-full flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-cyber-blue" />
            </div>
            <h2 className="text-xl font-bold text-cyber-text text-center">{user.name}</h2>
            <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-cyber-dark border border-cyber-border rounded-full">
              <Shield className="w-4 h-4 text-cyber-blue" />
              <span className="text-sm text-cyber-blue font-medium">{user.role}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-cyber-card border border-cyber-border rounded-lg p-6">
            <h3 className="text-lg font-medium text-cyber-text mb-4 border-b border-cyber-border pb-2">Account Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-cyber-dark rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-cyber-muted" />
                </div>
                <div>
                  <p className="text-sm text-cyber-muted">Email Address</p>
                  <p className="text-cyber-text font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-cyber-dark rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-cyber-muted" />
                </div>
                <div>
                  <p className="text-sm text-cyber-muted">Member Since</p>
                  <p className="text-cyber-text font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-cyber-dark rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-cyber-muted" />
                </div>
                <div>
                  <p className="text-sm text-cyber-muted">Total Activity Logs</p>
                  <p className="text-cyber-text font-medium">{user.activityCount || 0} Events Recorded</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
