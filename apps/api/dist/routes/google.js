"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const google_auth_library_1 = require("google-auth-library");
const User_1 = require("../models/User");
const jwt_1 = require("../lib/jwt");
const router = (0, express_1.Router)();
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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
        const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        if (!payload?.email) {
            res.status(400).json({ message: "Invalid Google token" });
            return;
        }
        const { sub: googleId, email, name, picture } = payload;
        let user = await User_1.User.findOne({ $or: [{ googleId }, { email }] });
        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                user.avatar = user.avatar || picture;
                await user.save();
            }
        }
        else {
            user = await User_1.User.create({
                name: name || email.split("@")[0],
                email,
                googleId,
                avatar: picture,
            });
        }
        const accessToken = (0, jwt_1.signAccessToken)(user.id);
        const refreshToken = (0, jwt_1.signRefreshToken)(user.id);
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTS);
        res.json({ accessToken, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
    }
    catch {
        res.status(401).json({ message: "Failed to verify Google token" });
    }
});
exports.default = router;
//# sourceMappingURL=google.js.map