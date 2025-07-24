import React, { createContext, useState, useContext, useEffect } from 'react';
import supabase from '../lib/supabase';

// Create context
const AdminContext = createContext();

// Provider component
export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check admin session on mount
  useEffect(() => {
    checkAdminSession();
  }, []);

  // Check if admin is logged in
  const checkAdminSession = async () => {
    try {
      setLoading(true);
      
      // Check if we have a token in localStorage
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setLoading(false);
        return;
      }

      // For both deployed and local environments, use the same authentication
      // In a real app, you would verify the JWT token properly
      // For this demo, we'll accept the token if it exists and has the correct format
      if (token.startsWith('mock-jwt-token') || token.startsWith('supabase-jwt-token')) {
        const adminData = {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@uniquestays.com',
          role: 'admin',
          status: 'active'
        };
        setAdmin(adminData);
        setIsAuthenticated(true);
      } else {
        // Invalid token
        localStorage.removeItem('admin_token');
      }
    } catch (error) {
      console.error('Session check failed:', error);
      localStorage.removeItem('admin_token');
    } finally {
      setLoading(false);
    }
  };

  // Admin login
  const login = async (email, password) => {
    try {
      // Hardcoded credentials for demo
      if (email === 'admin@uniquestays.com' && password === 'admin123!@#') {
        const mockToken = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('admin_token', mockToken);
        
        const adminData = {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@uniquestays.com',
          role: 'admin',
          status: 'active'
        };
        
        setAdmin(adminData);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  // Admin logout
  const logout = () => {
    localStorage.removeItem('admin_token');
    setAdmin(null);
    setIsAuthenticated(false);
  };

  // Get auth headers for API calls
  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  return (
    <AdminContext.Provider value={{
      admin,
      loading,
      isAuthenticated,
      login,
      logout,
      getAuthHeaders
    }}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook for using admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};