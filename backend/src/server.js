import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/auth.routes.js";
import analyzeRoutes from "./routes/analyze.routes.js";
import historyRoutes from "./routes/history.routes.js";
import usageRoutes from "./routes/usage.routes.js";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/usage", usageRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const msg = err.message || "Server error";
  res.status(status).json({ message: msg });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Backend running on :${PORT}`));
  })
  .catch((e) => {
    console.error("❌ DB connection failed", e);
    process.exit(1);
  });
