"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PasswordInput } from "@/components/auth/password-input";
import { useAuth } from "../../../../context/auth-context";
import { Sparkles, ArrowRight } from "lucide-react";

function ForgotPasswordContent() {
  const { requestPasswordReset, verifyPasswordReset } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"request" | "verify">("request");
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setStep("verify");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await verifyPasswordReset(email, otp, newPassword);
      // Success! Send to login or home
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
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
              {step === "request" ? "Reset your password" : "Enter reset code"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {step === "request" 
                ? "Enter your email address and we'll send you a recovery code." 
                : `We've sent a 6-digit code to ${email}.`}
            </p>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {step === "request" ? (
                <motion.form
                  key="request-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleRequestOtp} 
                  className="space-y-4 mt-8"
                >
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? "Sending..." : (
                      <>
                        Send Reset Code <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="verify-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleVerifyOtp} 
                  className="space-y-4 mt-8"
                >
                  {error && (
                    <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive border border-destructive/20">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="otp" className="block text-sm font-medium text-foreground">
                      6-Digit Code
                    </label>
                    <input
                      id="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="block w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-center tracking-widest text-lg"
                      placeholder="123456"
                      maxLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-foreground">
                      New Password
                    </label>
                    <PasswordInput
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      showStrength={true}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setStep("request")}
                    className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Didn't receive a code? Try again.
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Back to sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right side: Visual/Quote */}
      <div className="hidden lg:flex flex-1 relative bg-zinc-900 items-center justify-center overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-zinc-900 z-0"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[30rem] h-[30rem] bg-pink-500/20 rounded-full blur-3xl opacity-50"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 p-12 max-w-2xl text-white"
        >
          <div className="mb-8">
            <Sparkles className="w-12 h-12 text-primary/80 mb-6" />
            <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
              Don't worry, it happens to everyone.
            </h1>
            <p className="text-xl text-zinc-300 leading-relaxed font-light">
              We'll get you back to booking reliable home services in no time.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
