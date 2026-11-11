import express, { Router, Response } from "express";
import { supabase } from "../lib/db";
import { requireAuth, AuthRequest } from "../middleware/requireAuth";
import { apiRateLimit } from "../middleware/authRateLimit";

const router: Router = express.Router();
const bookingRateLimit = apiRateLimit(30);

// ─── Create a Booking ──────────────────────────────────────────────────────
router.post("/", requireAuth, bookingRateLimit, async (req: AuthRequest, res: Response) => {
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
    console.error("Failed to create booking:", error.message);
    res.status(500).json({ message: "Failed to create booking" });
    return;
  }

  res.status(201).json({ message: "Booking confirmed", booking: data });
});

// ─── Get User's Bookings ───────────────────────────────────────────────────
router.get("/", requireAuth, bookingRateLimit, async (req: AuthRequest, res: Response) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("customer_id", req.userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch bookings:", error.message);
    res.status(500).json({ message: "Failed to fetch bookings" });
    return;
  }

  res.json({ bookings: data });
});

export default router;
