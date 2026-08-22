"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { useAuth } from "../../../../context/auth-context";
import { Sparkles } from "lucide-react";

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push(from);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex bg-background">
      {/* Left side: Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
              <Sparkles className="w-6 h-6 text-primary" />
              QuickDidi
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please enter your details to sign in.
            </p>
          </div>

          <div className="space-y-6">
            <GoogleAuthButton mode="login" />

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-background px-6 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side: Visual/Quote */}
      <div className="hidden lg:flex flex-1 relative bg-zinc-900 items-center justify-center overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-zinc-900 z-0"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[30rem] h-[30rem] bg-indigo-500/20 rounded-full blur-3xl opacity-50"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 p-12 max-w-2xl text-white"
        >
          <div className="mb-8">
            <Sparkles className="w-12 h-12 text-primary/80 mb-6" />
            <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
              Welcome back to effortless home services.
            </h1>
            <p className="text-xl text-zinc-300 leading-relaxed font-light">
              "QuickDidi has transformed how I manage my home. Reliable professionals are just a tap away."
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-8">
            <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold">
              AM
            </div>
            <div>
              <p className="font-semibold">Anjali M.</p>
              <p className="text-sm text-zinc-400">Loyal Customer</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}