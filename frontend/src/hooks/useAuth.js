import { useState, useEffect } from 'react';

// Simple auth hook using localStorage
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('soulsync_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('soulsync_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('soulsync_user', JSON.stringify(userData));
    setUser(userData);
  };

  const signup = (userData) => {
    localStorage.setItem('soulsync_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('soulsync_user');
    localStorage.removeItem('soulsync_conversations');
    localStorage.removeItem('soulsync_mood_history');
    setUser(null);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('soulsync_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateUser,
  };
};
