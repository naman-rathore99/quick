import { Router, Request, Response } from "express";
import { supabase } from "../lib/db";
import { apiRateLimit } from "../middleware/authRateLimit";

const router = Router();
const servicesRateLimit = apiRateLimit(60);

// ─── Get Global Services ───────────────────────────────────────────────────
router.get("/", servicesRateLimit, async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("global_services")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    res.status(503).json({ message: "Failed to fetch services" });
    return;
  }

  res.json({ services: data });
});

export default router;
