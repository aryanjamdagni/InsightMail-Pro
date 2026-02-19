import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import ReactMarkdown from "react-markdown";
import SidePanel from "../components/SidePanel";
import Select from "../components/Select";
import { Copy, CheckCircle2, Download } from "lucide-react";
import { useOutletContext } from "react-router-dom";

function fmt(d) {
  return new Date(d).toLocaleString();
}

function getName(x) {
  return x.userName || x.user?.name || x.name || x.userDisplayName || "";
}

function getEmail(x) {
  return x.userEmail || x.user?.email || x.email || "";
}

function initials(nameOrEmail) {
  const s = String(nameOrEmail || "").trim();
  if (!s) return "U";
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (s.includes("@")) return s.split("@")[0].slice(0, 2).toUpperCase();
  return s.slice(0, 2).toUpperCase();
}

function sentimentBadge(sent) {
  const s = String(sent || "Neutral").toLowerCase();
  if (s.includes("pos"))
    return "bg-emerald-500/15 text-emerald-700 border border-emerald-500/25 dark:text-emerald-300";
  if (s.includes("neg"))
    return "bg-rose-500/15 text-rose-700 border border-rose-500/25 dark:text-rose-300";
  return "bg-slate-200/70 text-slate-700 border border-slate-300/70 dark:bg-white/10 dark:text-white/70 dark:border-white/15";
}

function downloadText(filename, text) {
  const blob = new Blob([String(text || "")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "approved.md";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function History() {
  const { toast } = useOutletContext();

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");

  const [sourceFilter, setSourceFilter] = useState("all");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [approvedFilter, setApprovedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [loadingItem, setLoadingItem] = useState(false);

  async function load() {
    const r = await api.get("/api/history");
    setItems(r.data?.items || []);
  }

  useEffect(() => {
    load();
  }, []);

  const sourceOptions = [
    { value: "all", label: "All Sources" },
    { value: "text", label: "Text" },
    { value: "image", label: "Image" },
    { value: "pdf", label: "PDF" },
  ];

  const sentimentOptions = [
    { value: "all", label: "All Sentiments" },
    { value: "positive", label: "Positive" },
    { value: "neutral", label: "Neutral" },
    { value: "negative", label: "Negative" },
  ];

  const approvedOptions = [
    { value: "all", label: "All" },
    { value: "yes", label: "Approved" },
    { value: "no", label: "Not Approved" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function openItem(id) {
    setOpen(true);
    setLoadingItem(true);
    setActive(null);
    try {
      const r = await api.get(`/api/history/${id}`);
      setActive(r.data?.item || null);
    } finally {
      setLoadingItem(false);
    }
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();

    let list = items;

    if (sourceFilter !== "all") {
      list = list.filter((x) => String(x.source || "") === sourceFilter);
    }

    if (sentimentFilter !== "all") {
      list = list.filter((x) => String(x.sentiment || "Neutral").toLowerCase().includes(sentimentFilter));
    }

    if (approvedFilter !== "all") {
      const want = approvedFilter === "yes";
      list = list.filter((x) => !!x.approved === want);
    }

    if (s) {
      list = list.filter((x) =>
        [
          getName(x),
          getEmail(x),
          x.source,
          x.inputPreview,
          x.sentiment,
          x.approved ? "approved" : "not approved",
        ]
          .join(" ")
          .toLowerCase()
          .includes(s)
      );
    }

    if (sortBy === "oldest") {
      return [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [items, q, sourceFilter, sentimentFilter, approvedFilter, sortBy]);

  function copyText(txt) {
    try {
      navigator.clipboard.writeText(String(txt || ""));
      toast?.({ type: "success", message: "Copied" });
    } catch {
      toast?.({ type: "error", message: "Copy failed" });
    }
  }

  return (
    <div className="space-y-4">
      <div className="imp-card imp-section-tight sticky top-[88px] z-40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="imp-title">History</div>
            <div className="imp-subtitle">Activity from present to past</div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-end">
            <div className="w-[360px] max-w-[72vw]">
              <input
                className="w-full imp-input px-4 py-3 text-sm outline-none"
                placeholder="Search by name/email/source/sentiment..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <Select value={sourceFilter} onChange={setSourceFilter} options={sourceOptions} className="w-[150px]" />
            <Select value={sentimentFilter} onChange={setSentimentFilter} options={sentimentOptions} className="w-[160px]" />
            <Select value={approvedFilter} onChange={setApprovedFilter} options={approvedOptions} className="w-[140px]" />
            <Select value={sortBy} onChange={setSortBy} options={sortOptions} className="w-[170px]" />
          </div>
        </div>
      </div>

      <div className="imp-card p-0 overflow-x-auto scrollbar">
        <table className="imp-table min-w-[1180px]">
          <thead>
            <tr>
              <th>When</th>
              <th>User</th>
              <th>Source</th>
              <th>Sentiment</th>
              <th>Preview</th>
              <th>Approved</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((x) => {
              const name = getName(x) || (getEmail(x) ? getEmail(x).split("@")[0] : "User");
              const email = getEmail(x);
              const src = String(x.source || "").toUpperCase();
              const prev = String(x.inputPreview || "");
              const sent = String(x.sentiment || "Neutral");

              return (
                <tr
                  key={x._id}
                  className="border-t border-[color:var(--line)] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition"
                  onClick={() => openItem(x._id)}
                >
                  <td className="whitespace-nowrap">{fmt(x.createdAt)}</td>

                  <td className="">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full border border-[color:var(--line)] bg-white/10 grid place-items-center font-semibold">
                        {initials(name || email)}
                      </div>

                      <div className="min-w-0">
                        <div className="font-semibold truncate max-w-[260px]">{name}</div>
                        <div className="text-[11px] text-[color:var(--muted)] truncate max-w-[320px]">{email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap">
                    <span className="imp-input px-3 py-1 text-xs font-semibold">{src || "—"}</span>
                  </td>

                  <td className="whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sentimentBadge(sent)}`}>{sent}</span>
                  </td>

                  <td className="">
                    <div className="truncate max-w-[520px] text-[color:var(--muted)]">{prev || "—"}</div>
                  </td>

                  <td className="whitespace-nowrap">
                    {x.approved ? (
                      <span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-300 font-semibold">
                        <CheckCircle2 size={16} /> Approved
                      </span>
                    ) : (
                      <span className="text-[color:var(--muted)]">No</span>
                    )}
                  </td>

                  <td className="whitespace-nowrap text-[color:var(--muted)]">{Number(x.timeTakenSec || 0)}s</td>
                </tr>
              );
            })}

            {!filtered.length && (
              <tr>
                <td colSpan={7} className="text-[color:var(--muted)]">
                  No history entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <SidePanel open={open} onClose={() => setOpen(false)} title="History Details">
        {loadingItem || !active ? (
          <div className="text-sm text-[color:var(--muted)]">Loading...</div>
        ) : (
          <div className="space-y-4">
            <div className="imp-card-solid p-4">
              <div className="text-xs text-[color:var(--muted)]">USER</div>
              <div className="mt-2 font-semibold">{getName(active) || "User"}</div>
              <div className="text-sm text-[color:var(--muted)]">{getEmail(active) || "—"}</div>
            </div>

            <div className="imp-card-solid p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-[color:var(--muted)]">OUTPUT</div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">Approved email markdown</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="imp-btn px-3 py-2 text-sm inline-flex items-center gap-2"
                    onClick={() => copyText(active.outputMarkdown)}
                  >
                    <Copy size={16} /> Copy
                  </button>

                  <button
                    className="imp-btn px-3 py-2 text-sm inline-flex items-center gap-2"
                    onClick={() => downloadText(`approved_${active._id}.md`, active.outputMarkdown)}
                  >
                    <Download size={16} /> Download
                  </button>
                </div>
              </div>

              <div className="mt-4 prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown>{String(active.outputMarkdown || "")}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </SidePanel>
    </div>
  );
}
