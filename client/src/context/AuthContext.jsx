import React, { createContext, useState, useEffect } from 'react';
import { getProfile, loginUser, logoutUser, registerUser } from '../api/auth';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await getProfile();
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    try {
      const res = await loginUser(data);
      setUser(res.data);
      toast.success(`Welcome back, ${res.data.name}`);
      return res.data;
    } catch (err) {
      toast.error('Login failed: Invalid credentials');
      throw err;
    }
  };

  const register = async (data) => {
    try {
      const res = await registerUser(data);
      setUser(res.data);
      toast.success(`Registration successful. Welcome, ${res.data.name}`);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.success('Logged out securely');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
