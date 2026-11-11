"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = exports.createAuthClient = void 0;
exports.connectDB = connectDB;
const supabase_js_1 = require("@supabase/supabase-js");
const createAuthClient = () => (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
    },
});
exports.createAuthClient = createAuthClient;
exports.supabase = (0, exports.createAuthClient)();
// We don't need a persistent connection like mongoose, so this is just for startup checks if needed
async function connectDB() {
    console.log("✅ Supabase client initialized");
}
//# sourceMappingURL=db.js.map