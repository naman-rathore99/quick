"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const db_1 = require("../lib/db");
async function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const token = authHeader.slice(7);
    try {
        const { data: { user }, error } = await db_1.supabase.auth.getUser(token);
        if (error || !user)
            throw error;
        req.userId = user.id;
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}
//# sourceMappingURL=requireAuth.js.map