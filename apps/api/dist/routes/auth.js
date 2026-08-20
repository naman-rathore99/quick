"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const User_1 = require("../models/User");
const jwt_1 = require("../lib/jwt");
const email_1 = require("../lib/email");
const requireAuth_1 = require("../middleware/requireAuth");
const router = (0, express_1.Router)();
const REFRESH_COOKIE = "refreshToken";
const COOKIE_OPTS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
function setRefreshCookie(res, token) {
    res.cookie(REFRESH_COOKIE, token, COOKIE_OPTS);
}
function safeUser(user) {
    return { id: user.id || user._id?.toString(), name: user.name, email: user.email, avatar: user.avatar };
}
// ─── Register ──────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    if (password.length < 8) {
        res.status(400).json({ message: "Password must be at least 8 characters" });
        return;
    }
    const existing = await User_1.User.findOne({ email });
    if (existing) {
        res.status(409).json({ message: "Email already in use" });
        return;
    }
    const user = await User_1.User.create({ name, email, password });
    const accessToken = (0, jwt_1.signAccessToken)(user.id);
    const refreshToken = (0, jwt_1.signRefreshToken)(user.id);
    user.refreshToken = refreshToken;
    await user.save();
    setRefreshCookie(res, refreshToken);
    res.status(201).json({ accessToken, user: safeUser(user) });
});
// ─── Login ─────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    }
    const user = await User_1.User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const accessToken = (0, jwt_1.signAccessToken)(user.id);
    const refreshToken = (0, jwt_1.signRefreshToken)(user.id);
    user.refreshToken = refreshToken;
    await user.save();
    setRefreshCookie(res, refreshToken);
    res.json({ accessToken, user: safeUser(user) });
});
// ─── Refresh Token ─────────────────────────────────────────────────────────
router.post("/refresh", async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) {
        res.status(401).json({ message: "No refresh token" });
        return;
    }
    try {
        const payload = (0, jwt_1.verifyRefreshToken)(token);
        const user = await User_1.User.findById(payload.sub).select("+refreshToken");
        if (!user || user.refreshToken !== token) {
            res.status(401).json({ message: "Invalid refresh token" });
            return;
        }
        const accessToken = (0, jwt_1.signAccessToken)(user.id);
        const newRefresh = (0, jwt_1.signRefreshToken)(user.id);
        user.refreshToken = newRefresh;
        await user.save();
        setRefreshCookie(res, newRefresh);
        res.json({ accessToken });
    }
    catch {
        res.status(401).json({ message: "Invalid or expired refresh token" });
    }
});
// ─── Me ────────────────────────────────────────────────────────────────────
router.get("/me", requireAuth_1.requireAuth, async (req, res) => {
    const user = await User_1.User.findById(req.userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(safeUser(user));
});
// ─── Logout ────────────────────────────────────────────────────────────────
router.post("/logout", requireAuth_1.requireAuth, async (req, res) => {
    await User_1.User.findByIdAndUpdate(req.userId, { refreshToken: undefined });
    res.clearCookie(REFRESH_COOKIE);
    res.json({ message: "Logged out" });
});
// ─── Forgot Password ───────────────────────────────────────────────────────
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
    }
    const user = await User_1.User.findOne({ email });
    if (!user) {
        res.json({ message: "If that email exists, a reset link has been sent" });
        return;
    }
    const token = crypto_1.default.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await (0, email_1.sendPasswordResetEmail)(email, resetUrl);
    res.json({ message: "If that email exists, a reset link has been sent" });
});
// ─── Reset Password ────────────────────────────────────────────────────────
router.post("/reset-password", async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) {
        res.status(400).json({ message: "Token and new password are required" });
        return;
    }
    if (password.length < 8) {
        res.status(400).json({ message: "Password must be at least 8 characters" });
        return;
    }
    const hashed = crypto_1.default.createHash("sha256").update(token).digest("hex");
    const user = await User_1.User.findOne({
        resetPasswordToken: hashed,
        resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");
    if (!user) {
        res.status(400).json({ message: "Invalid or expired reset token" });
        return;
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Password reset successfully" });
});
exports.default = router;
//# sourceMappingURL=auth.js.map