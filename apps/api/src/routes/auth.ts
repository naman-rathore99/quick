import { Router, Request, Response } from "express";
import { supabase } from "../lib/db";
import { requireAuth, AuthRequest } from "../middleware/requireAuth";

const router: Router = Router();

const REFRESH_COOKIE = "refreshToken";
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, COOKIE_OPTS);
}

function safeUser(user: any) {
  return { 
    id: user.id, 
    name: user.user_metadata?.full_name || user.email?.split("@")[0], 
    email: user.email, 
    avatar: user.user_metadata?.avatar_url 
  };
}

// ─── Register ──────────────────────────────────────────────────────────────
router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) { res.status(400).json({ message: "All fields are required" }); return; }
  if (password.length < 8) { res.status(400).json({ message: "Password must be at least 8 characters" }); return; }

  const assignedRole = role === "provider" ? "provider" : "customer";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name, role: assignedRole } }
  });

  if (error || !data.session) {
    res.status(400).json({ message: error?.message || "Registration failed. (Email may require confirmation)" });
    return;
  }

  // Also make sure they are in the public.users table with the correct role
  // (In case the database trigger doesn't map it correctly, we force an upsert here for reliability)
  if (data.user) {
    await supabase.from("users").upsert({
      id: data.user.id,
      full_name: name,
      role: assignedRole,
      updated_at: new Date().toISOString()
    });
  }

  setRefreshCookie(res, data.session.refresh_token);
  res.status(201).json({ accessToken: data.session.access_token, user: safeUser(data.user) });
});

// ─── Login ─────────────────────────────────────────────────────────────────
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400).json({ message: "Email and password are required" }); return; }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error || !data.session) {
    res.status(401).json({ message: error?.message || "Invalid credentials" }); return;
  }

  setRefreshCookie(res, data.session.refresh_token);
  res.json({ accessToken: data.session.access_token, user: safeUser(data.user) });
});

// ─── Refresh Token ─────────────────────────────────────────────────────────
router.post("/refresh", async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) { res.status(401).json({ message: "No refresh token" }); return; }

  const { data, error } = await supabase.auth.refreshSession({ refresh_token: token });

  if (error || !data.session) {
    res.status(401).json({ message: "Invalid or expired refresh token" }); return;
  }

  setRefreshCookie(res, data.session.refresh_token);
  res.json({ accessToken: data.session.access_token });
});

// ─── Me ────────────────────────────────────────────────────────────────────
router.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  if (!req.user) { res.status(404).json({ message: "User not found" }); return; }
  res.json(safeUser(req.user));
});

// ─── Logout ────────────────────────────────────────────────────────────────
router.post("/logout", requireAuth, async (req: AuthRequest, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    await supabase.auth.admin.signOut(token);
  }
  res.clearCookie(REFRESH_COOKIE);
  res.json({ message: "Logged out" });
});

// ─── Forgot Password ───────────────────────────────────────────────────────
router.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) { res.status(400).json({ message: "Email is required" }); return; }

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: resetUrl,
  });

  if (error) {
    console.error("Reset password error:", error);
  }
  
  res.json({ message: "If that email exists, a reset link has been sent" });
});

// ─── Reset Password ────────────────────────────────────────────────────────
router.post("/reset-password", async (req: Request, res: Response) => {
  const { token, password } = req.body;
  // With Supabase, token reset usually implies we use the pkce flow or have the user logged in directly via a hash in the url.
  // Since we accept a token and password here, if you have a raw recovery token:
  if (!token || !password) { res.status(400).json({ message: "Token and new password are required" }); return; }
  if (password.length < 8) { res.status(400).json({ message: "Password must be at least 8 characters" }); return; }

  const { error } = await supabase.auth.verifyOtp({ email: token, token, type: 'recovery' });
  if(error){
    res.status(400).json({ message: "Invalid or expired reset token" }); return;
  }

  const { error: updateError } = await supabase.auth.updateUser({ password });
  if(updateError){
    res.status(400).json({ message: updateError.message }); return;
  }

  res.json({ message: "Password reset successfully" });
});

export default router;