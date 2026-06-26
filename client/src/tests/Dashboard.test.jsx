import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Dashboard from '../pages/Dashboard';
import { AuthContext } from '../context/AuthContext';
import React from 'react';

const mockUser = {
  id: 1,
  name: 'System Administrator',
  email: 'admin@iip.local',
  role: 'ADMIN'
};

const renderDashboard = () => {
  return render(
    <AuthContext.Provider value={{ user: mockUser }}>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Dashboard Component', () => {
  it('renders dashboard with active cases section', () => {
    renderDashboard();
    // Assuming Dashboard renders 'Active Investigations'
    expect(screen.getByText('Active Investigations')).toBeDefined();
    expect(screen.getByText('New Investigation')).toBeDefined(); // The create button
  });
});
