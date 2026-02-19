import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { analyzeText, analyzeImage, analyzePdf, upload } from "../controllers/analyze.controller.js";

const r = Router();

r.post("/text", requireAuth, analyzeText);
r.post("/image", requireAuth, upload.single("file"), analyzeImage);
r.post("/pdf", requireAuth, upload.single("file"), analyzePdf);

export default r;
