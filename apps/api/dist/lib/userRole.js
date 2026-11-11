"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRole = getUserRole;
const db_1 = require("./db");
async function getUserRole(userId) {
    const { data, error } = await db_1.supabase.from("users").select("role").eq("id", userId).maybeSingle();
    if (error)
        throw error;
    return data?.role?.toLowerCase() === "provider" ? "provider" : "customer";
}
//# sourceMappingURL=userRole.js.map