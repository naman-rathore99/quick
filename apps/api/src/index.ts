import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db";
import authRoutes from "./routes/auth";
import googleRoutes from "./routes/google";
import bookingsRoutes from "./routes/bookings";
import servicesRoutes from "./routes/services";
import providersRoutes from "./routes/providers";

const app = express();
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

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  exposedHeaders: ["Retry-After"],
}));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.use("/auth", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.use("/auth", authRoutes);
app.use("/auth", googleRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/services", servicesRoutes);
app.use("/providers", providersRoutes);

app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    ...(IS_PROD ? {} : { uptime: process.uptime(), env: process.env.NODE_ENV }),
  });
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
});