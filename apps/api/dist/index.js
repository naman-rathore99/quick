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
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/auth", auth_1.default);
app.use("/auth", google_1.default);
app.get("/health", (_, res) => res.json({ ok: true }));
(0, db_1.connectDB)().then(() => {
    app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
});
//# sourceMappingURL=index.js.map