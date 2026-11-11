"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const requireAuth_1 = require("../middleware/requireAuth");
const authRateLimit_1 = require("../middleware/authRateLimit");
const router = (0, express_1.Router)();
const providerRateLimit = (0, authRateLimit_1.apiRateLimit)(60); // 60 requests/minute per IP
// ─── Provider Onboarding ───────────────────────────────────────────────────
router.post("/onboard", requireAuth_1.requireAuth, providerRateLimit, async (req, res) => {
    const { location, bio, services, phone } = req.body ?? {};
    if (typeof location !== "string" || !location.trim() || location.length > 200 ||
        typeof bio !== "string" || !bio.trim() || bio.length > 2000 ||
        typeof phone !== "string" || !/^\+?[0-9]{7,15}$/.test(phone.trim()) ||
        !Array.isArray(services) || services.length === 0 || services.length > 20 ||
        services.some((service) => typeof service?.service_id !== "string" ||
            !Number.isFinite(service.custom_price) || service.custom_price <= 0) ||
        new Set(services.map((service) => service.service_id)).size !== services.length) {
        res.status(400).json({ message: "Enter an area, a valid phone number, a bio and a price for each distinct service." });
        return;
    }
    const { error } = await db_1.supabase.rpc("save_provider_application", {
        account_id: req.userId,
        area: location.trim(),
        profile_bio: bio.trim(),
        offers: services,
        contact_phone: phone.trim(),
    });
    if (error) {
        const invalidProfile = error.code === "P0002";
        res.status(invalidProfile ? 409 : 503).json({
            message: invalidProfile ? "Your account profile is missing. Contact support before applying." : "Could not save your profile. Please try again.",
        });
        return;
    }
    res.status(201).json({ message: "Onboarding successful. You are now a provider!" });
});
// ─── Get Providers for a Service ───────────────────────────────────────────
router.get("/", providerRateLimit, async (req, res) => {
    const { service_id } = req.query;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    // Validate service_id format if provided
    if (service_id && (typeof service_id !== "string" || !uuidRegex.test(service_id))) {
        res.status(400).json({ message: "Invalid service filter." });
        return;
    }
    let query = db_1.supabase
        .from("provider_services")
        .select(`
      id,
      service_id,
      custom_price,
      bundle_name,
      bio,
      users ( id, name, location, is_verified )
    `);
    if (service_id) {
        query = query.eq("service_id", service_id);
    }
    const { data, error } = await query;
    if (error) {
        res.status(503).json({ message: "Failed to fetch providers" });
        return;
    }
    res.json({ providers: data });
});
exports.default = router;
//# sourceMappingURL=providers.js.map