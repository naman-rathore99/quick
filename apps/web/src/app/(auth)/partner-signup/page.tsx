"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "../../../../context/auth-context";
import { Sparkles, ArrowRight, ShieldCheck, Banknote, Clock } from "lucide-react";

function PartnerSignupContent() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, "provider");
      router.push("/onboarding/provider");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
              QuickDidi <span className="text-primary">Partners</span>
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
              Become a Didi
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Take control of your earnings and work on your own schedule.
            </p>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4 mt-8">
              {error && (
                <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-foreground">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Priya Sharma"
                />
              </div>

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
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Min. 8 characters"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Creating account..." : (
                  <>
                    Start Earning <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Already a partner?{" "}
              <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Sign in
              </Link>
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Looking to book a service?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Sign up as a Customer
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right side: Visual/Quote */}
      <div className="hidden lg:flex flex-1 relative bg-zinc-950 items-center justify-center overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-zinc-950 z-0"></div>
        <div className="absolute top-0 left-0 -translate-y-12 -translate-x-1/3 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 translate-y-1/3 translate-x-1/3 w-[30rem] h-[30rem] bg-emerald-500/20 rounded-full blur-3xl opacity-50"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 p-12 max-w-2xl text-white"
        >
          <div className="mb-12">
            <h1 className="text-6xl font-extrabold tracking-tight mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
              Your Price.<br />
              Your Work.<br />
              Your Pay.
            </h1>
            <p className="text-2xl text-zinc-300 font-light max-w-lg">
              Take complete control of your career. You decide when to work, what services to offer, and how much to charge.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mt-12">
            <div className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-2xl border border-zinc-800">
              <Banknote className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Keep what you earn</h3>
              <p className="text-sm text-zinc-400">Industry leading payouts directly to your bank account.</p>
            </div>
            <div className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-2xl border border-zinc-800">
              <Clock className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Flexible hours</h3>
              <p className="text-sm text-zinc-400">Be your own boss. Work only when it suits your schedule.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function PartnerSignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PartnerSignupContent />
    </Suspense>
  );
}
