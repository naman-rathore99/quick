"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const requireAuth_1 = require("../middleware/requireAuth");
const authRateLimit_1 = require("../middleware/authRateLimit");
const router = (0, express_1.Router)();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REFRESH_COOKIE = "refreshToken";
const IS_PROD = process.env.NODE_ENV === "production";
const COOKIE_OPTS = {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
};
function setRefreshCookie(res, token) {
    res.cookie(REFRESH_COOKIE, token, COOKIE_OPTS);
}
function safeUser(user) {
    return {
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split("@")[0],
        email: user.email,
        avatar: user.user_metadata?.avatar_url
    };
}
// ─── Register ──────────────────────────────────────────────────────────────
router.post("/register", (0, authRateLimit_1.authRateLimit)(8, 4), async (req, res) => {
    const { name, email, password, role } = req.body ?? {};
    if (typeof name !== "string" || !name.trim() || name.trim().length > 100 ||
        typeof email !== "string" || !email.trim() || email.trim().length > 254 || !EMAIL_REGEX.test(email.trim()) ||
        typeof password !== "string" || password.length < 8 || password.length > 128) {
        res.status(400).json({ message: "Provide a valid name, email address, and password (8-128 characters)." });
        return;
    }
    const assignedRole = role === "provider" ? "provider" : "customer";
    const { data, error } = await db_1.supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { full_name: name.trim(), role: assignedRole } }
    });
    if (error || !data.session) {
        console.error("Registration error:", error?.message);
        const status = error?.status === 429 ? 429 : 400;
        res.status(status).json({ message: status === 429 ? "Too many attempts. Try again shortly." : "Registration failed. Check your details and try again." });
        return;
    }
    // Also make sure they are in the public.users table with the correct role
    if (data.user) {
        await db_1.supabase.from("users").upsert({
            id: data.user.id,
            full_name: name.trim(),
            role: assignedRole,
            updated_at: new Date().toISOString()
        });
    }
    setRefreshCookie(res, data.session.refresh_token);
    res.status(201).json({ accessToken: data.session.access_token, user: safeUser(data.user) });
});
// ─── Login ─────────────────────────────────────────────────────────────────
router.post("/login", (0, authRateLimit_1.authRateLimit)(20, 6), async (req, res) => {
    const { email, password } = req.body ?? {};
    if (typeof email !== "string" || !email.trim() || email.trim().length > 254 || !EMAIL_REGEX.test(email.trim()) ||
        typeof password !== "string" || !password || password.length > 128) {
        res.status(400).json({ message: "Valid email and password are required" });
        return;
    }
    const { data, error } = await db_1.supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error || !data.session) {
        res.status(error?.status === 429 ? 429 : 401).json({
            message: error?.status === 429 ? "Too many sign-in attempts. Try again shortly." : "Invalid credentials"
        });
        return;
    }
    setRefreshCookie(res, data.session.refresh_token);
    res.json({ accessToken: data.session.access_token, user: safeUser(data.user) });
});
// ─── Refresh Token ─────────────────────────────────────────────────────────
router.post("/refresh", (0, authRateLimit_1.authRateLimit)(45), async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) {
        res.status(401).json({ message: "No refresh token" });
        return;
    }
    const { data, error } = await db_1.supabase.auth.refreshSession({ refresh_token: token });
    if (error || !data.session) {
        res.status(401).json({ message: "Invalid or expired refresh token" });
        return;
    }
    setRefreshCookie(res, data.session.refresh_token);
    res.json({ accessToken: data.session.access_token });
});
// ─── Me ────────────────────────────────────────────────────────────────────
router.get("/me", requireAuth_1.requireAuth, (0, authRateLimit_1.authRateLimit)(60), async (req, res) => {
    if (!req.user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(safeUser(req.user));
});
// ─── Logout ────────────────────────────────────────────────────────────────
router.post("/logout", (0, authRateLimit_1.authRateLimit)(30), async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.slice(7).trim();
        if (token) {
            await db_1.supabase.auth.admin.signOut(token).catch(() => undefined);
        }
    }
    res.clearCookie(REFRESH_COOKIE, COOKIE_OPTS);
    res.json({ message: "Logged out" });
});
// ─── Forgot Password ───────────────────────────────────────────────────────
router.post("/forgot-password", (0, authRateLimit_1.authRateLimit)(8, 3), async (req, res) => {
    const { email } = req.body ?? {};
    if (typeof email !== "string" || !email.trim() || email.trim().length > 254 || !EMAIL_REGEX.test(email.trim())) {
        res.status(400).json({ message: "A valid email address is required" });
        return;
    }
    const resetUrl = `${process.env.FRONTEND_URL || "https://www.quickdidi.com"}/reset-password`;
    const { error } = await db_1.supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: resetUrl,
    });
    if (error) {
        console.error("Reset password error:", error);
    }
    res.json({ message: "If that email exists, a reset link has been sent" });
});
// ─── Reset Password ────────────────────────────────────────────────────────
router.post("/reset-password", (0, authRateLimit_1.authRateLimit)(10), async (req, res) => {
    const { token, password } = req.body ?? {};
    if (typeof token !== "string" || !token.trim() || token.length > 500 ||
        typeof password !== "string" || password.length < 8 || password.length > 128) {
        res.status(400).json({ message: "Valid token and new password (8-128 characters) are required" });
        return;
    }
    const { error } = await db_1.supabase.auth.verifyOtp({ email: token.trim(), token: token.trim(), type: 'recovery' });
    if (error) {
        res.status(400).json({ message: "Invalid or expired reset token" });
        return;
    }
    const { error: updateError } = await db_1.supabase.auth.updateUser({ password });
    if (updateError) {
        console.error("Password update error:", updateError.message);
        res.status(400).json({ message: "Could not update password. Try a stronger password." });
        return;
    }
    res.json({ message: "Password reset successfully" });
});
exports.default = router;
//# sourceMappingURL=auth.js.map