import { useState, useEffect, type ReactNode } from 'react';
import type { LoginResponse, User } from '../types/auth';
import { httpClient } from '../api/httpClient';
import { authStorage } from '../utils/authStorage';
import { AuthContext } from './authContextObject';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => authStorage.getUser());
  const [accessToken, setAccessToken] = useState<string | null>(() => authStorage.getToken());
  const [isRestoring, setIsRestoring] = useState<boolean>(() => Boolean(authStorage.getToken()));

  useEffect(() => {
    const token = authStorage.getToken();
    if (!token) return;

    httpClient<User>('/auth/me')
      .then((freshUser) => {
        setUser(freshUser);
        authStorage.setUser(freshUser);
      })
      .catch(() => {
        authStorage.clear();
        setAccessToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsRestoring(false);
      });
  }, []);

  const login = async (username: string, password: string) => {
    const data = await httpClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, expiresInMins: 60 }),
    });

    const userData: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    authStorage.setToken(data.accessToken);
    authStorage.setUser(userData);
    setAccessToken(data.accessToken);
    setUser(userData);
  };

  const logout = () => {
    authStorage.clear();
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: Boolean(accessToken),
        isRestoring,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};