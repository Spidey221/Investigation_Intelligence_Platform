import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    // Frontend only: fake authentication, navigate straight to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark p-4">
      <div className="w-full max-w-md glass-card p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_rgba(0,240,255,0.1)_0%,_transparent_50%)] pointer-events-none"></div>
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <ShieldAlert size={48} className="text-cyber-blue mb-4 drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
          <h1 className="text-2xl font-bold text-cyber-text tracking-widest">IIP CORE</h1>
          <p className="text-cyber-textMuted text-sm mt-2">Authorized Personnel Only</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-medium text-cyber-textMuted mb-1">Agent Email</label>
            <input 
              type="email" 
              required
              className="input-field" 
              placeholder="agent@iip.gov"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-cyber-textMuted mb-1">Passcode</label>
            <input 
              type="password" 
              required
              className="input-field" 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-4 text-lg">
            <LogIn size={20} />
            Authenticate
          </button>
        </form>
        
        <div className="mt-6 text-center relative z-10">
          <p className="text-sm text-cyber-textMuted">
            New operative? <Link to="/register" className="text-cyber-blue hover:underline">Request Access</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
