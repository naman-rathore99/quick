"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../lib/db");
const requireAuth_1 = require("../middleware/requireAuth");
const router = express_1.default.Router();
// ─── Create a Booking ──────────────────────────────────────────────────────
router.post("/", requireAuth_1.requireAuth, async (req, res) => {
    const { serviceId, scheduledFor, agreedPrice, providerId } = req.body;
    if (!serviceId || !scheduledFor) {
        res.status(400).json({ message: "Service ID and scheduled time are required" });
        return;
    }
    const { data, error } = await db_1.supabase
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
router.get("/", requireAuth_1.requireAuth, async (req, res) => {
    const { data, error } = await db_1.supabase
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
exports.default = router;
//# sourceMappingURL=bookings.js.map