import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Load admin login state from localStorage on mount
  useEffect(() => {
    const savedAdminState = localStorage.getItem('isAdminLoggedIn');
    if (savedAdminState === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const loginAdmin = (username, password) => {
    if (username === 'admin123' && password === 'admin123') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('isAdminLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('isAdminLoggedIn');
  };

  const value = {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
