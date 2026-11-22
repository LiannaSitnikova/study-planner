import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { LoginResponse, User } from '../types/auth';
import { httpClient } from '../api/httpClient';
import { authStorage } from '../utils/authStorage';

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => authStorage.getUser());
  const [accessToken, setAccessToken] = useState<string | null>(() => authStorage.getToken());
  const [isRestoring, setIsRestoring] = useState<boolean>(() => Boolean(authStorage.getToken()));

  useEffect(() => {
    const token = authStorage.getToken();
    if (!token) {
      setIsRestoring(false);
      return;
    }

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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth має використовуватися всередині AuthProvider');
  }
  return ctx;
};