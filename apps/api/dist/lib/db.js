"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
exports.connectDB = connectDB;
const supabase_js_1 = require("@supabase/supabase-js");
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ FATAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in environment variables!");
}
exports.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL || "https://placeholder.supabase.co", process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder", {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
// We don't need a persistent connection like mongoose, so this is just for startup checks if needed
async function connectDB() {
    console.log("✅ Supabase client initialized");
}
//# sourceMappingURL=db.js.map