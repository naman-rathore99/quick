"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const router = (0, express_1.Router)();
const REFRESH_COOKIE = "refreshToken";
const COOKIE_OPTS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
router.post("/google", async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        res.status(400).json({ message: "ID token is required" });
        return;
    }
    try {
        const { data, error } = await db_1.supabase.auth.signInWithIdToken({
            provider: "google",
            token: idToken,
        });
        if (error || !data.session) {
            res.status(401).json({ message: error?.message || "Failed to verify Google token with Supabase" });
            return;
        }
        res.cookie(REFRESH_COOKIE, data.session.refresh_token, COOKIE_OPTS);
        const user = data.user;
        res.json({
            accessToken: data.session.access_token,
            user: {
                id: user.id,
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