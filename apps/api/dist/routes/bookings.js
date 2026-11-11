"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userRole_1 = require("../lib/userRole");
const express_1 = require("express");
const db_1 = require("../lib/db");
const requireAuth_1 = require("../middleware/requireAuth");
const authRateLimit_1 = require("../middleware/authRateLimit");
const router = (0, express_1.Router)();
const bookingRateLimit = (0, authRateLimit_1.apiRateLimit)(30); // 30 requests/minute per IP
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
router.post("/", requireAuth_1.requireAuth, bookingRateLimit, async (req, res) => {
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
    const priorBooking = () => db_1.supabase.from("bookings").select("id, status, agreed_price")
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
    const { data: offer, error: offerError } = await db_1.supabase
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
    const { error: profileError } = await db_1.supabase.from("users").upsert({
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
    const { data, error } = await db_1.supabase.from("bookings").insert({
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
        if (existing.data)
            res.json({ booking: existing.data });
        else
            res.status(409).json({ message: "That appointment time was taken. Choose a different time." });
        return;
    }
    if (error) {
        res.status(503).json({ message: "Could not save your booking. Please retry." });
        return;
    }
    res.status(201).json({ booking: data });
});
// ─── Get User's Bookings ───────────────────────────────────────────────────
router.get("/", requireAuth_1.requireAuth, bookingRateLimit, async (req, res) => {
    const { data, error } = await db_1.supabase
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
router.get("/assigned", requireAuth_1.requireAuth, bookingRateLimit, async (req, res) => {
    try {
        if (!req.userId || await (0, userRole_1.getUserRole)(req.userId) !== "provider") {
            res.status(403).json({ message: "Provider access required" });
            return;
        }
        const { data, error } = await db_1.supabase
            .from("bookings")
            .select("id, scheduled_for, status, agreed_price")
            .eq("provider_id", req.userId)
            .order("scheduled_for", { ascending: true });
        if (error)
            throw error;
        res.json({ bookings: data });
    }
    catch {
        res.status(500).json({ message: "Could not load assigned bookings" });
    }
});
router.patch("/:id/response", requireAuth_1.requireAuth, bookingRateLimit, async (req, res) => {
    const { id } = req.params;
    const { decision } = req.body ?? {};
    if (typeof id !== "string" || !uuid.test(id) || (decision !== "accept" && decision !== "decline")) {
        res.status(400).json({ message: "Choose a valid booking and response." });
        return;
    }
    try {
        if (!req.userId || await (0, userRole_1.getUserRole)(req.userId) !== "provider") {
            res.status(403).json({ message: "Provider access required." });
            return;
        }
        const status = decision === "accept" ? "ACCEPTED" : "CANCELLED";
        const { data, error } = await db_1.supabase.from("bookings")
            .update({ status }).eq("id", id).eq("provider_id", req.userId).eq("status", "PENDING")
            .select("id, status").maybeSingle();
        if (error)
            throw error;
        if (data) {
            res.json({ booking: data });
            return;
        }
        const current = await db_1.supabase.from("bookings").select("id, status")
            .eq("id", id).eq("provider_id", req.userId).maybeSingle();
        if (current.error)
            throw current.error;
        if (current.data?.status === status)
            res.json({ booking: current.data });
        else if (current.data)
            res.status(409).json({ message: "This request has already been answered. Refresh your bookings." });
        else
            res.status(404).json({ message: "Assigned booking not found." });
    }
    catch {
        res.status(500).json({ message: "Could not save your response. Please retry." });
    }
});
exports.default = router;
//# sourceMappingURL=bookings.js.map