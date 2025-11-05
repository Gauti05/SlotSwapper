import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);

    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });  // Use api instance here
    setToken(res.data.token);
  };

  const signup = async (name, email, password) => {
    const res = await api.post('/api/auth/signup', { name, email, password });  // Use api instance here
    setToken(res.data.token);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
