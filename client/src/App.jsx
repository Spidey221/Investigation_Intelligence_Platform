import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import CaseDetails from './pages/CaseDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cases" element={<Dashboard />} />
          <Route path="/cases/:id" element={<CaseDetails />} />
          <Route path="/settings" element={<div className="p-8 text-cyber-text">Settings Module (WIP)</div>} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#13131a',
          color: '#e2e8f0',
          border: '1px solid #2a2a35'
        }
      }} />
    </BrowserRouter>
  );
}

export default App;
