import { Router, Request, Response } from "express";
import { supabase } from "../lib/db";

const router = Router();

// ─── Get Global Services ───────────────────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("global_services")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    res.status(500).json({ message: "Failed to fetch services", error: error.message });
    return;
  }

  res.json({ services: data });
});

export default router;
