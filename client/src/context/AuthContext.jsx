import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('comparekart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('comparekart_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync profile & wishlist on mount
  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('comparekart_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid token');
          logout();
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('comparekart_token', res.data.token);
      localStorage.setItem('comparekart_user', JSON.stringify(res.data.user));
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  const signup = async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password });
    if (res.data.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('comparekart_token', res.data.token);
      localStorage.setItem('comparekart_user', JSON.stringify(res.data.user));
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('comparekart_token');
    localStorage.removeItem('comparekart_user');
  };

  // Toggle product in wishlist
  const toggleWishlist = async (productId) => {
    if (!token) {
      return { success: false, requireAuth: true };
    }
    try {
      const res = await api.post(`/auth/wishlist/${productId}`);
      if (res.data.success) {
        const updatedUser = { ...user, wishlist: res.data.wishlist };
        setUser(updatedUser);
        localStorage.setItem('comparekart_user', JSON.stringify(updatedUser));
        return { success: true, action: res.data.action };
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    }
    return { success: false };
  };

  const isInWishlist = (productId) => {
    if (!user || !user.wishlist) return false;
    return user.wishlist.some(item => {
      const id = typeof item === 'object' ? item._id : item;
      return id === productId;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        signup,
        logout,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
