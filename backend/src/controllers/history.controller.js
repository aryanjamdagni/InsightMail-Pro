import Activity from "../models/Activity.js";
import { httpError } from "../utils/httpError.js";

export async function listHistory(req, res, next) {
  try {
    const isAdmin = req.user.role === "admin";
    const q = isAdmin ? {} : { userId: req.user.id };

    const items = await Activity.find(q)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const cleaned = items.map((x) => ({
      ...x,
      userName: x.userId?.name || "",
      userEmail: x.userId?.email || x.userEmail || "",
    }));

    res.json({ items: cleaned });
  } catch (e) {
    next(e);
  }
}

export async function getHistoryItem(req, res, next) {
  try {
    const isAdmin = req.user.role === "admin";

    const item = await Activity.findById(req.params.id)
      .populate("userId", "name email")
      .lean();

    if (!item) return next(httpError(404, "Not found"));

    if (!isAdmin && String(item.userId?._id) !== String(req.user.id)) {
      return next(httpError(403, "Forbidden"));
    }

    res.json({
      item: {
        ...item,
        userName: item.userId?.name || "",
        userEmail: item.userId?.email || item.userEmail || "",
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function approveResponse(req, res, next) {
  try {
    const { activityId, approvedMarkdown } = req.body || {};
    const item = await Activity.findById(activityId);
    if (!item) return next(httpError(404, "Not found"));

    const isAdmin = req.user.role === "admin";
    if (!isAdmin && String(item.userId) !== String(req.user.id)) {
      return next(httpError(403, "Forbidden"));
    }

    item.approved = true;
    item.approvedAt = new Date();
    item.approvedMarkdown = String(approvedMarkdown || item.responseMarkdown || "");
    await item.save();

    res.json({ ok: true, itemId: item._id });
  } catch (e) {
    next(e);
  }
}
