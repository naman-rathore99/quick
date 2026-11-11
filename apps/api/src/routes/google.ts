import { Router, Request, Response } from "express";
import { supabase } from "../lib/db";
import { authRateLimit } from "../middleware/authRateLimit";

const router: Router = Router();

const REFRESH_COOKIE = "refreshToken";
const IS_PROD = process.env.NODE_ENV === "production";
const COOKIE_OPTS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

router.post("/google", authRateLimit(15), async (req: Request, res: Response) => {
  const { idToken } = req.body ?? {};
  if (typeof idToken !== "string" || !idToken.trim()) { res.status(400).json({ message: "ID token is required" }); return; }

  try {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: idToken.trim(),
    });

    if (error || !data.session) {
      console.error("Google auth error:", error?.message);
      res.status(401).json({ message: "Failed to verify Google token with Supabase" }); 
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
  } catch (error) {
    res.status(401).json({ message: "Failed to verify Google token" });
  }
});

export default router;