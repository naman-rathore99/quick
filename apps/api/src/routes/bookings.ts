import { Router, Response } from "express";
import { supabase } from "../lib/db";
import { requireAuth, AuthRequest } from "../middleware/requireAuth";

const router = Router();

// ─── Create a Booking ──────────────────────────────────────────────────────
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  const { serviceId, scheduledFor, agreedPrice, providerId } = req.body;
  
  if (!serviceId || !scheduledFor) { 
    res.status(400).json({ message: "Service ID and scheduled time are required" }); 
    return; 
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        customer_id: req.userId,
        provider_id: providerId || null,
        service_id: serviceId,
        scheduled_for: scheduledFor,
        agreed_price: agreedPrice || 0,
        status: "pending",
        payment_status: "pending"
      }
    ])
    .select()
    .single();

  if (error) {
    res.status(500).json({ message: "Failed to create booking", error: error.message });
    return;
  }

  res.status(201).json({ message: "Booking confirmed", booking: data });
});

// ─── Get User's Bookings ───────────────────────────────────────────────────
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("customer_id", req.userId)
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
    return;
  }

  res.json({ bookings: data });
});

export default router;
