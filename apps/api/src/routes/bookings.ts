import { getUserRole } from "../lib/userRole";
import { Router, Response } from "express";
import { supabase } from "../lib/db";
import { requireAuth, AuthRequest } from "../middleware/requireAuth";
import { apiRateLimit } from "../middleware/authRateLimit";

const router = Router();
const bookingRateLimit = apiRateLimit(30);  // 30 requests/minute per IP

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

router.post("/", requireAuth, bookingRateLimit, async (req: AuthRequest, res: Response) => {
  const { serviceId, scheduledFor, providerId, quantity = 1, contactName, phone, address, requestId } = req.body ?? {};
  if (![serviceId, providerId, requestId].every((value) => typeof value === "string" && uuid.test(value)) ||
    !Number.isInteger(quantity) || quantity < 1 || quantity > 10 ||
    typeof scheduledFor !== "string" || !Number.isFinite(Date.parse(scheduledFor)) ||
    typeof contactName !== "string" || !contactName.trim() || contactName.length > 100 ||
    typeof phone !== "string" || !/^[+0-9 ()-]{7,20}$/.test(phone) ||
    typeof address !== "string" || !address.trim() || address.length > 500) {
    res.status(400).json({ message: "Choose a service and provider and enter valid appointment and contact details." });
    return;
  }

  const priorBooking = () => supabase.from("bookings").select("id, status, agreed_price")
    .eq("customer_id", req.userId).eq("request_id", requestId).maybeSingle();

  const prior = await priorBooking();
  if (prior.error) {
    res.status(503).json({ message: "Bookings are temporarily unavailable." });
    return;
  }
  if (prior.data) {
    res.json({ booking: prior.data });
    return;
  }
  if (Date.parse(scheduledFor) <= Date.now()) {
    res.status(400).json({ message: "Choose a time in the future." });
    return;
  }

  const { data: offer, error: offerError } = await supabase
    .from("provider_services").select("custom_price")
    .eq("provider_id", providerId).eq("service_id", serviceId)
    .order("custom_price", { ascending: true }).limit(1).maybeSingle();
  if (offerError) {
    res.status(503).json({ message: "Service prices are temporarily unavailable." });
    return;
  }
  const unitPrice = Number(offer?.custom_price);
  if (providerId === req.userId || !Number.isFinite(unitPrice) || unitPrice <= 0) {
    res.status(400).json({ message: "This provider does not offer the selected service." });
    return;
  }

  const { error: profileError } = await supabase.from("users").upsert({
    id: req.userId,
    name: contactName.trim(),
    phone: phone.trim(),
    role: "CUSTOMER",
  }, { onConflict: "id", ignoreDuplicates: true });
  if (profileError) {
    res.status(profileError.code === "23505" ? 409 : 503).json({
      message: profileError.code === "23505"
        ? "This phone number is already linked to another profile."
        : "Could not prepare your customer profile. Please retry.",
    });
    return;
  }

  const { data, error } = await supabase.from("bookings").insert({
    customer_id: req.userId,
    provider_id: providerId,
    service_id: serviceId,
    scheduled_for: scheduledFor,
    agreed_price: unitPrice * quantity,
    quantity,
    contact_name: contactName.trim(),
    contact_phone: phone.trim(),
    service_address: address.trim(),
    request_id: requestId,
    status: "PENDING",
    payment_status: "PENDING",
  }).select("id, status, agreed_price").single();

  if (error?.code === "23505") {
    const existing = await priorBooking();
    if (existing.data) res.json({ booking: existing.data });
    else res.status(409).json({ message: "That appointment time was taken. Choose a different time." });
    return;
  }
  if (error) {
    res.status(503).json({ message: "Could not save your booking. Please retry." });
    return;
  }
  res.status(201).json({ booking: data });
});

// ─── Get User's Bookings ───────────────────────────────────────────────────
router.get("/", requireAuth, bookingRateLimit, async (req: AuthRequest, res: Response) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, global_services(name)")
    .eq("customer_id", req.userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch bookings:", error.message);
    res.status(500).json({ message: "Failed to fetch bookings" });
    return;
  }

  res.json({ bookings: data });
});

router.get("/assigned", requireAuth, bookingRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId || await getUserRole(req.userId) !== "provider") {
      res.status(403).json({ message: "Provider access required" });
      return;
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("id, scheduled_for, status, agreed_price")
      .eq("provider_id", req.userId)
      .order("scheduled_for", { ascending: true });

    if (error) throw error;
    res.json({ bookings: data });
  } catch {
    res.status(500).json({ message: "Could not load assigned bookings" });
  }
});

router.patch("/:id/response", requireAuth, bookingRateLimit, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { decision } = req.body ?? {};
  if (typeof id !== "string" || !uuid.test(id) || (decision !== "accept" && decision !== "decline")) {
    res.status(400).json({ message: "Choose a valid booking and response." });
    return;
  }

  try {
    if (!req.userId || await getUserRole(req.userId) !== "provider") {
      res.status(403).json({ message: "Provider access required." });
      return;
    }
    const status = decision === "accept" ? "ACCEPTED" : "CANCELLED";
    const { data, error } = await supabase.from("bookings")
      .update({ status }).eq("id", id).eq("provider_id", req.userId).eq("status", "PENDING")
      .select("id, status").maybeSingle();
    if (error) throw error;
    if (data) {
      res.json({ booking: data });
      return;
    }

    const current = await supabase.from("bookings").select("id, status")
      .eq("id", id).eq("provider_id", req.userId).maybeSingle();
    if (current.error) throw current.error;
    if (current.data?.status === status) res.json({ booking: current.data });
    else if (current.data) res.status(409).json({ message: "This request has already been answered. Refresh your bookings." });
    else res.status(404).json({ message: "Assigned booking not found." });
  } catch {
    res.status(500).json({ message: "Could not save your response. Please retry." });
  }
});

export default router;
