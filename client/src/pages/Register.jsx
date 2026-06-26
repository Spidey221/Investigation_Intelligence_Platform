import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, UserPlus } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  const handleRegister = (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Frontend only: fake registration, navigate straight to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark p-4">
      <div className="w-full max-w-md glass-card p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_rgba(0,240,255,0.1)_0%,_transparent_50%)] pointer-events-none"></div>
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <ShieldAlert size={40} className="text-cyber-blue mb-3 drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
          <h1 className="text-xl font-bold text-cyber-text tracking-widest">CLEARANCE REQUEST</h1>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-medium text-cyber-textMuted mb-1">Full Name</label>
            <input 
              type="text" 
              required
              className="input-field" 
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-cyber-textMuted mb-1">Confirm Passcode</label>
            <input 
              type="password" 
              required
              className="input-field" 
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>
          
          <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-2 text-lg">
            <UserPlus size={20} />
            Submit Request
          </button>
        </form>
        
        <div className="mt-6 text-center relative z-10">
          <p className="text-sm text-cyber-textMuted">
            Already have clearance? <Link to="/login" className="text-cyber-blue hover:underline">Authenticate</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
