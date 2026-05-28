import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('inkwave_token'));
  const [loading, setLoading] = useState(true);

  // Fetch current user from /api/auth/me on mount or token change
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getMe();
        setUser(res.data.user || res.data);
      } catch {
        // Token invalid or expired
        localStorage.removeItem('inkwave_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = useCallback((data) => {
    const { token: newToken, user: newUser } = data;
    localStorage.setItem('inkwave_token', newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const register = useCallback((data) => {
    const { token: newToken, user: newUser } = data;
    localStorage.setItem('inkwave_token', newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('inkwave_token');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((data) => {
    setUser((prev) => ({ ...prev, ...data }));
  }, []);

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
