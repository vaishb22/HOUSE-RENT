import React, { createContext, useState, useEffect } from 'react';
import { userService } from '../services/services';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for stored token on mount - but DON'T auto-login
  // User must explicitly login each time (unless Remember Me is checked on login)
  useEffect(() => {
    // Only restore session if explicitly saved via Remember Me
    const savedCredentials = localStorage.getItem('savedCredentials');
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    // If there's saved credentials with Remember Me, we need to validate them
    // For now, just clear everything to show login page first
    // The actual auto-login will happen after successful login with Remember Me
    
    setLoading(false);
  }, []);

  // Register
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.register(userData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (credentials, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.login(credentials);
      const { token, user } = response.data;

      // Always save token for API calls
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Only save credentials if Remember Me is checked
      if (rememberMe) {
        localStorage.setItem('savedCredentials', JSON.stringify(credentials));
      } else {
        localStorage.removeItem('savedCredentials');
      }

      setToken(token);
      setUser(user);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Keep savedCredentials so user doesn't have to re-enter on next visit
    setToken(null);
    setUser(null);
    setError(null);
  };

  // Update User
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
