import { Router, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User";
import { signAccessToken, signRefreshToken } from "../lib/jwt";

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const REFRESH_COOKIE = "refreshToken";
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Frontend sends the Google ID token after Google Sign-In
router.post("/google", async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) {
    res.status(400).json({ message: "ID token is required" });
    return;
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      res.status(400).json({ message: "Invalid Google token" });
      return;
    }

    const { sub: googleId, email, name, picture } = payload;

    // Find by googleId or email (link accounts if email matches)
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Link Google to existing email account if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = user.avatar || picture;
        await user.save();
      }
    } else {
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        googleId,
        avatar: picture,
      });
    }

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTS);
    res.json({
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch {
    res.status(401).json({ message: "Failed to verify Google token" });
  }
});

export default router;