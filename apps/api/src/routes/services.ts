import { Router, Request, Response } from "express";
import { supabase } from "../lib/db";
import { apiRateLimit } from "../middleware/authRateLimit";

const router: Router = Router();
const servicesRateLimit = apiRateLimit(60);

// ─── Get Global Services ───────────────────────────────────────────────────
router.get("/", servicesRateLimit, async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("global_services")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch services:", error.message);
    res.status(500).json({ message: "Failed to fetch services" });
    return;
  }

  res.json({ services: data });
});

export default router;
