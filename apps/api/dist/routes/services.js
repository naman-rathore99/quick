"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const authRateLimit_1 = require("../middleware/authRateLimit");
const router = (0, express_1.Router)();
const servicesRateLimit = (0, authRateLimit_1.apiRateLimit)(60);
// ─── Get Global Services ───────────────────────────────────────────────────
router.get("/", servicesRateLimit, async (req, res) => {
    const { data, error } = await db_1.supabase
        .from("global_services")
        .select("*")
        .order("name", { ascending: true });
    if (error) {
        res.status(503).json({ message: "Failed to fetch services" });
        return;
    }
    res.json({ services: data });
});
exports.default = router;
//# sourceMappingURL=services.js.map