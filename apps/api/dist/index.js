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
const PORT = process.env.PORT || 4000;
const allowedOrigins = [
    "http://localhost:3000",
    "https://quickdidi.com",
    "https://www.quickdidi.com",
    process.env.FRONTEND_URL
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        // Allow any quickdidi domain or localhost
        if (origin.includes("quickdidi.com") || origin.includes("localhost")) {
            callback(null, true);
        }
        else {
            callback(null, false); // Return false instead of throwing an Error to prevent 500 crashes
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/auth", auth_1.default);
app.use("/auth", google_1.default);
app.use("/bookings", bookings_1.default);
app.use("/services", services_1.default);
app.use("/providers", providers_1.default);
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        env: process.env.NODE_ENV || "development",
    });
});
(0, db_1.connectDB)().then(() => {
    app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
});
//# sourceMappingURL=index.js.map