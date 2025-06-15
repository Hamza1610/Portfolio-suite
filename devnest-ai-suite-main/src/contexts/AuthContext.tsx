import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as authLogin, logout as authLogout, isAuthenticated } from '../services/authService';
import type { LoginCredentials } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const login = async (credentials: LoginCredentials) => {
    await authLogin(credentials);
    setAuthenticated(true);
  };

  const logout = () => {
    authLogout();
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: authenticated, login, logout }}>
      {children}
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