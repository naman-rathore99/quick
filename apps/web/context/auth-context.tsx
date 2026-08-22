"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { createClient } from "../utils/supabase/client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  verifyPasswordReset: (email: string, token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch the user's role from the public users table
        const { data } = await supabase
          .from("users")
          .select("full_name, role")
          .eq("id", session.user.id)
          .single();
        
        const profile = data as any;

        setUser({
          id: session.user.id,
          name: profile?.full_name || session.user.email?.split("@")[0] || "",
          email: session.user.email || "",
          role: profile?.role || "customer",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from("users")
          .select("full_name, role")
          .eq("id", session.user.id)
          .single();
        
        const profile = data as any;

        setUser({
          id: session.user.id,
          name: profile?.full_name || session.user.email?.split("@")[0] || "",
          email: session.user.email || "",
          role: profile?.role || "customer",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw new Error(error.message);
  };

  const register = async (name: string, email: string, pass: string, role?: string) => {
    const assignedRole = role === "provider" ? "provider" : "customer";
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { full_name: name, role: assignedRole }
      }
    });
    if (error) throw new Error(error.message);
    
    // Auto-insert into public.users to ensure role is captured immediately
    if (data.user) {
      await supabase.from("users").upsert({
        id: data.user.id,
        full_name: name,
        role: assignedRole,
        updated_at: new Date().toISOString()
      } as any);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const googleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) throw new Error(error.message);
  };

  const requestPasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
  };

  const verifyPasswordReset = async (email: string, token: string, newPassword: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery',
    });
    if (error) throw new Error(error.message);

    // After verifying OTP, the user is logged in. Now update the password.
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateError) throw new Error(updateError.message);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, googleLogin, requestPasswordReset, verifyPasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}