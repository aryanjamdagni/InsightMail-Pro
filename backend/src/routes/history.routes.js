import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listHistory, getHistoryItem, approveResponse } from "../controllers/history.controller.js";

const r = Router();

r.get("/", requireAuth, listHistory);
r.get("/:id", requireAuth, getHistoryItem);
r.post("/approve", requireAuth, approveResponse);

export default r;
