import { getUserRole } from "../lib/userRole";
import { authRateLimit } from "../middleware/authRateLimit";
import { Router, Request, Response } from "express";
import { createAuthClient } from "../lib/db";

const router = Router();

const REFRESH_COOKIE = "refreshToken";
const IS_PROD = process.env.NODE_ENV === "production";
const COOKIE_OPTS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "strict" as const,        // ← upgraded from "lax" to block CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/auth",                       // ← scope cookie to /auth paths only
};

router.post("/google", authRateLimit(15), async (req: Request, res: Response) => {
  const { idToken } = req.body ?? {};
  if (typeof idToken !== "string" || !idToken) { res.status(400).json({ message: "ID token is required" }); return; }

  try {
    const { data, error } = await createAuthClient().auth.signInWithIdToken({
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
        role: await getUserRole(user.id).catch(() => "customer"),
        name: user.user_metadata?.full_name || user.email?.split("@")[0], 
        email: user.email, 
        avatar: user.user_metadata?.avatar_url 
      } 
    });
  } catch (error) {
    res.status(401).json({ message: "Failed to verify Google token" });
  }
});

export default router;