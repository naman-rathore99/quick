"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userRole_1 = require("../lib/userRole");
const authRateLimit_1 = require("../middleware/authRateLimit");
const express_1 = require("express");
const db_1 = require("../lib/db");
const router = (0, express_1.Router)();
const REFRESH_COOKIE = "refreshToken";
const IS_PROD = process.env.NODE_ENV === "production";
const COOKIE_OPTS = {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "strict", // ← upgraded from "lax" to block CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
};
router.post("/google", (0, authRateLimit_1.authRateLimit)(15), async (req, res) => {
    const { idToken } = req.body ?? {};
    if (typeof idToken !== "string" || !idToken) {
        res.status(400).json({ message: "ID token is required" });
        return;
    }
    try {
        const { data, error } = await (0, db_1.createAuthClient)().auth.signInWithIdToken({
            provider: "google",
            token: idToken,
        });
        if (error || !data.session) {
            console.error("Google auth error:", error?.message);
            res.status(401).json({ message: "Google sign-in failed. Please try again." });
            return;
        }
        res.cookie(REFRESH_COOKIE, data.session.refresh_token, COOKIE_OPTS);
        const user = data.user;
        res.json({
            accessToken: data.session.access_token,
            user: {
                id: user.id,
                role: await (0, userRole_1.getUserRole)(user.id).catch(() => "customer"),
                name: user.user_metadata?.full_name || user.email?.split("@")[0],
                email: user.email,
                avatar: user.user_metadata?.avatar_url
            }
        });
    }
    catch (error) {
        res.status(401).json({ message: "Failed to verify Google token" });
    }
});
exports.default = router;
//# sourceMappingURL=google.js.map