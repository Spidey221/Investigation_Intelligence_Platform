import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Login from '../pages/Login';
import { AuthContext } from '../context/AuthContext';
import React from 'react';

const mockLogin = vi.fn();

const renderLogin = () => {
  return render(
    <AuthContext.Provider value={{ login: mockLogin }}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Login Component', () => {
  it('renders login form correctly', () => {
    renderLogin();
    expect(screen.getByText('Investigative Platform')).toBeDefined();
    expect(screen.getByPlaceholderText('investigator@agency.gov')).toBeDefined();
    expect(screen.getByPlaceholderText('••••••••')).toBeDefined();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
  });

  it('handles user input and submission', () => {
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('investigator@agency.gov');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'admin@iip.local' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    
    fireEvent.click(submitBtn);

    expect(mockLogin).toHaveBeenCalledWith({ email: 'admin@iip.local', password: 'admin123' });
  });
});
