import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      // Error handled by context toast
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-cyber-card border border-cyber-border rounded-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-cyber-border rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-cyber-blue" />
          </div>
          <h1 className="text-2xl font-bold text-cyber-text">Investigative Platform</h1>
          <p className="text-cyber-muted">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-cyber-muted mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-muted" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-cyber-text focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investigator@agency.gov"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-cyber-muted mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-muted" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-cyber-text focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-cyber-blue hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-cyber-muted">
          Don't have an account? <Link to="/register" className="text-cyber-blue hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
