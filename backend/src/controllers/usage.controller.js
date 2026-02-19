import UsageEntry from "../models/UsageEntry.js";

export async function getUsage(req, res, next) {
  try {
    const isAdmin = req.user.role === "admin";
    const q = isAdmin ? {} : { userId: req.user.id };

    const rows = await UsageEntry.find(q)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    const entries = rows.map((x) => ({
      ...x,
      userName: x.userId?.name || x.userName || "",
      userEmail: x.userId?.email || x.userEmail || "",
    }));

    const totalsMap = new Map();

    for (const e of entries) {
      const key = isAdmin ? String(e.userId?._id || e.userEmail) : "me";
      const prev = totalsMap.get(key) || {
        userName: isAdmin ? e.userName || "" : req.user.name || "",
        userEmail: isAdmin ? e.userEmail || "" : req.user.email || "",
        costUSD: 0,
      };

      prev.costUSD += Number(e.costUSD || 0);
      totalsMap.set(key, prev);
    }

    const totalsByUser = Array.from(totalsMap.values()).sort((a, b) => b.costUSD - a.costUSD);

    res.json({ entries, totalsByUser });
  } catch (e) {
    next(e);
  }
}
