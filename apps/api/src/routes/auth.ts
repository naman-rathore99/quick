import { getUserRole } from "../lib/userRole";
import { authRateLimit } from "../middleware/authRateLimit";
import { Router, Request, Response } from "express";
import { createAuthClient, supabase } from "../lib/db";
import { requireAuth, AuthRequest } from "../middleware/requireAuth";

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REFRESH_COOKIE = "refreshToken";
const IS_PROD = process.env.NODE_ENV === "production";
const COOKIE_OPTS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "strict" as const,        // ← upgraded from "lax" to block CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/auth",                       // ← scope cookie to /auth paths only
};

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, COOKIE_OPTS);
}

async function safeUser(user: any) {
  return { 
    id: user.id,
    role: await getUserRole(user.id).catch(() => "customer"),
    name: user.user_metadata?.full_name || user.email?.split("@")[0], 
    email: user.email, 
    avatar: user.user_metadata?.avatar_url 
  };
}

// ─── Register ──────────────────────────────────────────────────────────────
router.post("/register", authRateLimit(8, 4), async (req: Request, res: Response) => {
  const { name, email, password } = req.body ?? {};
  if (
    typeof name !== "string" || !name.trim() || name.trim().length > 100 ||
    typeof email !== "string" || !email.trim() || email.trim().length > 254 || !EMAIL_REGEX.test(email.trim()) ||
    typeof password !== "string" || password.length < 8 || password.length > 128
  ) {
    res.status(400).json({ message: "Provide a valid name, email address, and password (8-128 characters)." });
    return;
  }

  const { data, error } = await createAuthClient().auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { full_name: name.trim() } }
  });

  if (error) {
    console.error("Registration error:", error.message);
    const status = error.status === 429 ? 429 : 400;
    // Generic message — never leak whether the email already exists
    res.status(status).json({ message: status === 429 ? "Too many attempts. Try again shortly." : "Registration failed. Check your details and try again." });
    return;
  }
  if (!data.session) {
    res.status(202).json({ confirmationRequired: true });
    return;
  }

  setRefreshCookie(res, data.session.refresh_token);
  res.status(201).json({ accessToken: data.session.access_token, user: await safeUser(data.user) });
});

// ─── Login ─────────────────────────────────────────────────────────────────
router.post("/login", authRateLimit(20, 6), async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  if (
    typeof email !== "string" || !email.trim() || email.trim().length > 254 || !EMAIL_REGEX.test(email.trim()) ||
    typeof password !== "string" || !password || password.length > 128
  ) {
    res.status(400).json({ message: "Valid email and password are required" });
    return;
  }

  const { data, error } = await createAuthClient().auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
  
  if (error || !data.session) {
    res.status(error?.status === 429 ? 429 : 401).json({ message: error?.status === 429 ? "Too many sign-in attempts. Try again shortly." : "Invalid email or password" }); return;
  }

  setRefreshCookie(res, data.session.refresh_token);
  res.json({ accessToken: data.session.access_token, user: await safeUser(data.user) });
});

router.post("/oauth-session", authRateLimit(15), async (req, res) => {
  const { accessToken, refreshToken } = req.body ?? {};
  if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
    res.status(400).json({ message: "Missing sign-in session" });
    return;
  }
  const { data, error } = await createAuthClient().auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (error || !data.session) {
    res.status(401).json({ message: "Could not complete Google sign-in" });
    return;
  }
  setRefreshCookie(res, data.session.refresh_token);
  res.status(204).end();
});

// ─── Refresh Token ─────────────────────────────────────────────────────────
router.post("/refresh", authRateLimit(45), async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) { res.status(401).json({ message: "No refresh token" }); return; }

  const { data, error } = await createAuthClient().auth.refreshSession({ refresh_token: token });

  if (error || !data.session) {
    res.status(401).json({ message: "Invalid or expired refresh token" }); return;
  }

  setRefreshCookie(res, data.session.refresh_token);
  res.json({ accessToken: data.session.access_token });
});

// ─── Me ────────────────────────────────────────────────────────────────────
router.get("/me", requireAuth, authRateLimit(60), async (req: AuthRequest, res: Response) => {
  if (!req.user) { res.status(404).json({ message: "User not found" }); return; }
  res.json(await safeUser(req.user));
});

// ─── Logout ────────────────────────────────────────────────────────────────
router.post("/logout", authRateLimit(30), async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token) {
      await supabase.auth.admin.signOut(token, "local").catch(() => undefined);
    }
  }
  res.clearCookie(REFRESH_COOKIE, COOKIE_OPTS);
  res.json({ message: "Logged out" });
});

// ─── Forgot Password ───────────────────────────────────────────────────────
router.post("/forgot-password", authRateLimit(8, 3), async (req: Request, res: Response) => {
  const { email } = req.body ?? {};
  if (typeof email !== "string" || !email.trim() || email.trim().length > 254 || !EMAIL_REGEX.test(email.trim())) {
    res.status(400).json({ message: "A valid email address is required" });
    return;
  }

  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password`;
  const { error } = await createAuthClient().auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: resetUrl,
  });

  if (error) {
    console.error("Reset password error:", error);
  }
  
  res.json({ message: "If that email exists, a reset link has been sent" });
});

// ─── Reset Password ────────────────────────────────────────────────────────
router.post("/reset-password", authRateLimit(10), async (req: Request, res: Response) => {
  const { token, password, refreshToken } = req.body ?? {};
  if (
    typeof token !== "string" || !token.trim() || token.length > 500 ||
    typeof password !== "string" || password.length < 8 || password.length > 128 ||
    (refreshToken !== undefined && (typeof refreshToken !== "string" || refreshToken.length > 1000))
  ) {
    res.status(400).json({ message: "Valid token and new password (8-128 characters) are required" });
    return;
  }

  const { auth } = createAuthClient();
  const { data, error } = typeof refreshToken === "string" && refreshToken
    ? await auth.setSession({ access_token: token.trim(), refresh_token: refreshToken })
    : await auth.verifyOtp({ token_hash: token.trim(), type: "recovery" });
  if (error || !data.session) {
    res.status(400).json({ message: "Invalid or expired reset token" }); return;
  }

  const { error: updateError } = await auth.updateUser({ password });
  if(updateError){
    console.error("Password update error:", updateError.message);
    res.status(400).json({ message: "Could not update password. Try a stronger password." }); return;
  }

  res.json({ message: "Password reset successfully" });
});

export default router;