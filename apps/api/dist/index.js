"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./lib/db");
const auth_1 = __importDefault(require("./routes/auth"));
const google_1 = __importDefault(require("./routes/google"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const services_1 = __importDefault(require("./routes/services"));
const providers_1 = __importDefault(require("./routes/providers"));
const app = (0, express_1.default)();
app.disable("x-powered-by");
app.set("trust proxy", 1);
const PORT = process.env.PORT || 4000;
const IS_PROD = process.env.NODE_ENV === "production";
// ─── Security Headers (global) ─────────────────────────────────────────────
app.use((_req, res, next) => {
    res.set("X-Content-Type-Options", "nosniff");
    res.set("X-Frame-Options", "DENY");
    res.set("Referrer-Policy", "strict-origin-when-cross-origin");
    if (IS_PROD) {
        res.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    }
    next();
});
const allowedOrigins = new Set([
    "http://localhost:3000",
    "https://quickdidi.com",
    "https://www.quickdidi.com",
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
]);
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    },
    credentials: true,
    exposedHeaders: ["Retry-After"],
}));
app.use(express_1.default.json({ limit: "100kb" }));
app.use((0, cookie_parser_1.default)());
app.use("/auth", (_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});
app.use("/auth", auth_1.default);
app.use("/auth", google_1.default);
app.use("/bookings", bookings_1.default);
app.use("/services", services_1.default);
app.use("/providers", providers_1.default);
app.get("/health", (_req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        ...(IS_PROD ? {} : { uptime: process.uptime(), env: process.env.NODE_ENV }),
    });
});
(0, db_1.connectDB)().then(() => {
    app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
});
//# sourceMappingURL=index.js.map