import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error("Failed to parse stored user or token:", error);
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } else if (!user && !token && !loading) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user, token, loading]);


  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      setUser({ _id: data._id, email: data.email }); 
      setToken(data.token);
      navigate('/my-sessions');
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (email, password) => {
    try {
      const data = await authService.register({ email, password });
      setUser({ _id: data._id, email: data.email });
      setToken(data.token);
      navigate('/my-sessions'); 
      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // localStorage.removeItem('user'); // Handled by useEffect
    // localStorage.removeItem('token'); // Handled by useEffect
    navigate('/login');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};