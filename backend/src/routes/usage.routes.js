import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getUsage } from "../controllers/usage.controller.js";

const r = Router();

r.get("/", requireAuth, getUsage);

export default r;
