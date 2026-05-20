import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function decodeToken(token) {
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedCsrfToken = localStorage.getItem('csrfToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);
      setCsrfToken(storedCsrfToken);
      const decoded = decodeToken(storedToken);
      setUser({
        ...(storedUser ? JSON.parse(storedUser) : {}),
        role: decoded?.role,
      });
    }
  }, []);

  function login({ token: nextToken, csrfToken: nextCsrfToken, user: nextUser }) {
    const decoded = decodeToken(nextToken);
    const userWithoutRole = {
      id: nextUser.id,
      email: nextUser.email,
      name: nextUser.name,
    };

    setToken(nextToken);
    setCsrfToken(nextCsrfToken);
    setUser({ ...userWithoutRole, role: decoded?.role || nextUser.role });

    localStorage.setItem('token', nextToken);
    localStorage.setItem('csrfToken', nextCsrfToken);
    localStorage.setItem('user', JSON.stringify(userWithoutRole));
  }

  function logout() {
    setToken(null);
    setCsrfToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('csrfToken');
    localStorage.removeItem('user');
  }

  const value = useMemo(() => ({ token, csrfToken, user, login, logout }), [token, csrfToken, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
