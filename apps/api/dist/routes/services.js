"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const router = (0, express_1.Router)();
// ─── Get Global Services ───────────────────────────────────────────────────
router.get("/", async (req, res) => {
    const { data, error } = await db_1.supabase
        .from("global_services")
        .select("*")
        .order("name", { ascending: true });
    if (error) {
        res.status(500).json({ message: "Failed to fetch services", error: error.message });
        return;
    }
    res.json({ services: data });
});
exports.default = router;
//# sourceMappingURL=services.js.map