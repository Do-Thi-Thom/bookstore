import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onLoginCallbacks, setOnLoginCallbacks] = useState([]);

  useEffect(() => {
    // Kiểm tra user và token từ localStorage khi component mount
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password,
      });

      if (response && response.success) {
        const userInfo = {
          token: response.data?.token,
          username: response.data?.username,
          fullName: response.data?.fullName,
          email: response.data?.email,
          role: response.data?.role,
        };

        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
        localStorage.setItem('token', userInfo.token || '');

        // Execute login callbacks
        onLoginCallbacks.forEach(callback => callback());

        return { success: true, user: userInfo };
      }

      return { success: false, error: response?.message || 'Đăng nhập thất bại' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (payload) => {
    try {
      const response = await apiClient.post('/auth/register', {
        username: payload.username,
        password: payload.password,
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
      });

      if (response && response.success) {
        return { success: true, message: response.message };
      }

      return { success: false, error: response?.message || 'Đăng ký thất bại' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return { success: true, message: 'Đăng xuất thành công' };
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };



  const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Check if token is not expired (if it's a JWT token)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      // If token is not JWT format, assume it's valid
      return true;
    }
  };

  const addLoginCallback = useCallback((callback) => {
    setOnLoginCallbacks(prev => [...prev, callback]);
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isTokenValid,
    addLoginCallback
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
