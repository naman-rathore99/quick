"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { authApi, AuthUser } from "@/lib/auth-api";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Try to restore session on mount via refresh token cookie
  useEffect(() => {
    authApi.refresh()
      .then(({ accessToken: token }) => {
        setAccessToken(token);
        return authApi.me(token);
      })
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAuthResponse = useCallback(async (token: string, u: AuthUser) => {
    setAccessToken(token);
    setUser(u);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken: token, user: u } = await authApi.login(email, password);
    await handleAuthResponse(token, u);
  }, [handleAuthResponse]);

  const register = useCallback(async (name: string, email: string, password: string, role?: string) => {
    const { accessToken: token, user: u } = await authApi.register(name, email, password, role);
    await handleAuthResponse(token, u);
  }, [handleAuthResponse]);

  const googleLogin = useCallback(async (idToken: string) => {
    const { accessToken: token, user: u } = await authApi.googleAuth(idToken);
    await handleAuthResponse(token, u);
  }, [handleAuthResponse]);

  const logout = useCallback(async () => {
    if (accessToken) await authApi.logout(accessToken).catch(() => {});
    setAccessToken(null);
    setUser(null);
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}