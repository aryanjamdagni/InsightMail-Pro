import axios from "axios";
import FormData from "form-data";
import multer from "multer";
import Activity from "../models/Activity.js";
import UsageEntry from "../models/UsageEntry.js";
import { normalizeCost, estimateCostUSD } from "../utils/costing.js";

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

const ai = axios.create({
  baseURL: process.env.AI_BASE_URL || "http://127.0.0.1:8000/api/v1",
  timeout: 120000,
});

function previewText(t) {
  const s = String(t || "").trim().replace(/\s+/g, " ");
  return s.length > 180 ? s.slice(0, 180) + "…" : s;
}

function pickCostBlock(payload) {
  return (
    payload?.llm_cost_analysis ??
    payload?.llmCostAnalysis ??
    payload?.llm_cost ??
    payload?.llmCost ??
    payload?.usage ??
    payload?.token_usage ??
    payload?.tokenUsage ??
    null
  );
}

function pickModelFallback(payload) {
  const m =
    payload?.model ??
    payload?.llm ??
    payload?.model_name ??
    payload?.modelName ??
    null;

  return (m ? String(m) : null) || (process.env.AI_DEFAULT_MODEL ? String(process.env.AI_DEFAULT_MODEL) : null) || null;
}

export async function analyzeText(req, res, next) {
  try {
    const email_text = req.body?.email_text ?? req.body?.emailText ?? "";
    const t0 = Date.now();

    const r = await ai.post("/analyze/text", { email_text });

    const t1 = Date.now();
    const payload = r.data || {};
    const data = payload?.data ?? payload?.analysis ?? payload;

    const time_taken = Number(payload?.time_taken ?? payload?.timeTaken ?? (t1 - t0) / 1000);

    const responseMarkdown =
      typeof data === "string"
        ? data
        : data?.summary_markdown ?? data?.summary ?? JSON.stringify(data, null, 2);

    const parsed = normalizeCost(pickCostBlock(payload));
    const model = parsed?.model || pickModelFallback(payload);

    let tokensIn = null;
    let tokensOut = null;

    if (parsed) {
      const hasInOut = (parsed.tokensIn || 0) > 0 || (parsed.tokensOut || 0) > 0;
      if (hasInOut) {
        tokensIn = parsed.tokensIn || 0;
        tokensOut = parsed.tokensOut || 0;
      } else if ((parsed.totalTokens || 0) > 0) {
        tokensIn = parsed.totalTokens;
        tokensOut = null;
      }
    }

    const costUSD =
      (parsed?.costUSD && Number(parsed.costUSD) > 0)
        ? Number(parsed.costUSD)
        : (tokensIn != null || tokensOut != null)
          ? estimateCostUSD({ tokensIn: Number(tokensIn || 0), tokensOut: Number(tokensOut || 0) })
          : 0;

    const activity = await Activity.create({
      userId: req.user.id,
      userEmail: req.user.email,
      source: "text",
      inputPreview: previewText(email_text),
      timeTakenSec: time_taken,
      responseMarkdown,
      sentiment: data?.sentiment ?? "Neutral",
      multiIntent: Boolean(data?.multi_intent ?? data?.multiIntent ?? false),
      multiLingual: Boolean(data?.multi_lingual ?? data?.multiLingual ?? false),
      llm: model || "unknown",
    });

    await UsageEntry.create({
      userId: req.user.id,
      userName: req.user.name || "",
      userEmail: req.user.email,
      activityId: activity._id,
      process: "analyze_text",
      tokensIn,
      tokensOut,
      costUSD,
      model,
    });

    res.json({
      activityId: activity._id,
      data,
      responseMarkdown,
      meta: {
        time_taken,
        sentiment: data?.sentiment ?? "Neutral",
        multi_intent: Boolean(data?.multi_intent ?? false),
        multi_lingual: Boolean(data?.multi_lingual ?? false),
        cost_usd: costUSD,
        model: model || "unknown",
        tokens_in: tokensIn,
        tokens_out: tokensOut,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function analyzeFile(req, res, next, kind) {
  try {
    const file = req.file;
    const t0 = Date.now();

    const form = new FormData();
    form.append("file", file.buffer, { filename: file.originalname, contentType: file.mimetype });

    const r = await ai.post(`/analyze/${kind}`, form, { headers: form.getHeaders() });

    const t1 = Date.now();
    const payload = r.data || {};
    const data = payload?.data ?? payload?.analysis ?? payload;

    const time_taken = Number(payload?.time_taken ?? payload?.timeTaken ?? (t1 - t0) / 1000);

    const responseMarkdown =
      typeof data === "string"
        ? data
        : data?.summary_markdown ?? data?.summary ?? JSON.stringify(data, null, 2);

    const parsed = normalizeCost(pickCostBlock(payload));
    const model = parsed?.model || pickModelFallback(payload);

    let tokensIn = null;
    let tokensOut = null;

    if (parsed) {
      const hasInOut = (parsed.tokensIn || 0) > 0 || (parsed.tokensOut || 0) > 0;
      if (hasInOut) {
        tokensIn = parsed.tokensIn || 0;
        tokensOut = parsed.tokensOut || 0;
      } else if ((parsed.totalTokens || 0) > 0) {
        tokensIn = parsed.totalTokens;
        tokensOut = null;
      }
    }

    const costUSD =
      (parsed?.costUSD && Number(parsed.costUSD) > 0)
        ? Number(parsed.costUSD)
        : (tokensIn != null || tokensOut != null)
          ? estimateCostUSD({ tokensIn: Number(tokensIn || 0), tokensOut: Number(tokensOut || 0) })
          : 0;

    const activity = await Activity.create({
      userId: req.user.id,
      userEmail: req.user.email,
      source: kind === "image" ? "image" : "pdf",
      inputPreview: `${kind.toUpperCase()} • ${file.originalname}`,
      timeTakenSec: time_taken,
      responseMarkdown,
      sentiment: data?.sentiment ?? "Neutral",
      multiIntent: Boolean(data?.multi_intent ?? false),
      multiLingual: Boolean(data?.multi_lingual ?? false),
      llm: model || "unknown",
    });

    await UsageEntry.create({
      userId: req.user.id,
      userName: req.user.name || "",
      userEmail: req.user.email,
      activityId: activity._id,
      process: kind === "image" ? "analyze_image" : "analyze_pdf",
      tokensIn,
      tokensOut,
      costUSD,
      model,
    });

    res.json({
      activityId: activity._id,
      data,
      responseMarkdown,
      meta: {
        time_taken,
        sentiment: data?.sentiment ?? "Neutral",
        multi_intent: Boolean(data?.multi_intent ?? false),
        multi_lingual: Boolean(data?.multi_lingual ?? false),
        cost_usd: costUSD,
        model: model || "unknown",
        tokens_in: tokensIn,
        tokens_out: tokensOut,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function analyzeImage(req, res, next) {
  return analyzeFile(req, res, next, "image");
}

export async function analyzePdf(req, res, next) {
  return analyzeFile(req, res, next, "pdf");
}
