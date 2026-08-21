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
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://quickdidi.com",
  "https://www.quickdidi.com",
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    // Allow any quickdidi domain or localhost
    if (origin.includes("quickdidi.com") || origin.includes("localhost")) {
      callback(null, true);
    } else {
      callback(null, false); // Return false instead of throwing an Error to prevent 500 crashes
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/auth", googleRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/services", servicesRoutes);
app.use("/providers", providersRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV || "development",
  });
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
});