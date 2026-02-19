import { useMemo, useState } from "react";
import api from "../services/api";
import ReactMarkdown from "react-markdown";
import { Copy, Edit, RotateCcw, CheckCircle2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import ShimmerBlock from "../components/ShimmerBlock";
import FilePicker from "../components/FilePicker";

function pill(label, value) {
  return (
    <div className="imp-pill">
      <div className="imp-pill-label">{label}</div>
      <div className="imp-pill-value">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const { toast } = useOutletContext();

  const [source, setSource] = useState("text");
  const [emailText, setEmailText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [activityId, setActivityId] = useState(null);

  const [meta, setMeta] = useState({
    multi_intent: false,
    multi_lingual: false,
    sentiment: "Neutral",
    time_taken: "—",
    cost_usd: 0,
    model: "—",
  });

  const [markdown, setMarkdown] = useState("");
  const [editing, setEditing] = useState(false);
  const [approved, setApproved] = useState(false);

  const canGenerate = useMemo(() => {
    if (source === "text") return emailText.trim().length > 0;
    if (source === "image") return !!imageFile;
    if (source === "pdf") return !!pdfFile;
    return false;
  }, [source, emailText, imageFile, pdfFile]);

  function reset() {
    setEmailText("");
    setImageFile(null);
    setPdfFile(null);
    setMarkdown("");
    setEditing(false);
    setActivityId(null);
    setApproved(false);
    setMeta({
      multi_intent: false,
      multi_lingual: false,
      sentiment: "Neutral",
      time_taken: "—",
      cost_usd: 0,
      model: "—",
    });
  }

  async function generate() {
    setLoading(true);
    setApproved(false);
    try {
      let r;

      if (source === "text") {
        r = await api.post("/api/analyze/text", { email_text: emailText });
      } else if (source === "image") {
        const fd = new FormData();
        fd.append("file", imageFile);
        r = await api.post("/api/analyze/image", fd);
      } else if (source === "pdf") {
        const fd = new FormData();
        fd.append("file", pdfFile);
        r = await api.post("/api/analyze/pdf", fd);
      }

      const data = r?.data || {};
      setMarkdown(String(data.responseMarkdown || ""));
      setActivityId(data.activityId || null);

      const m = data.meta || {};
      setMeta({
        multi_intent: !!m.multi_intent,
        multi_lingual: !!m.multi_lingual,
        sentiment: m.sentiment || "Neutral",
        time_taken: m.time_taken ? `${Number(m.time_taken).toFixed(2)}s` : "—",
        cost_usd: Number(m.cost_usd || 0),
        model: m.model || "—",
      });

      toast?.({ type: "success", message: "Generated successfully" });
    } catch (e) {
      toast?.({ type: "error", message: e?.response?.data?.message || "Failed to generate" });
    } finally {
      setLoading(false);
    }
  }

  async function approve() {
    if (!activityId) return;
    try {
      await api.post("/api/history/approve", {
        activityId,
        approvedMarkdown: markdown,
      });
      setApproved(true);
      toast?.({ type: "success", message: "Approved & saved to History" });
    } catch (e) {
      toast?.({ type: "error", message: e?.response?.data?.message || "Approve failed" });
    }
  }

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
      <div className="imp-card p-5 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_.9fr] gap-5">
          <div>
            <div className="imp-section-title">Enter your E-mail</div>

            {source === "text" ? (
              <textarea
                className="imp-textarea mt-3"
                rows={7}
                placeholder="Enter or paste the email"
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
              />
            ) : (
              <div className="mt-3">
                <div className="text-xs text-[color:var(--muted)] mb-2">
                  Upload {source === "image" ? "Image" : "PDF"}
                </div>
                <FilePicker
                  accept={source === "image" ? "image/*" : "application/pdf"}
                  file={source === "image" ? imageFile : pdfFile}
                  onPick={(f) => (source === "image" ? setImageFile(f) : setPdfFile(f))}
                />
              </div>
            )}
          </div>

          <div>
            <div className="imp-section-title">Data Source</div>

            <div className="mt-3 space-y-3">
              <label className="imp-radio">
                <input type="radio" name="src" checked={source === "text"} onChange={() => setSource("text")} />
                <span>Text</span>
              </label>

              <label className="imp-radio">
                <input type="radio" name="src" checked={source === "image"} onChange={() => setSource("image")} />
                <span>Upload Image</span>
              </label>

              <label className="imp-radio">
                <input type="radio" name="src" checked={source === "pdf"} onChange={() => setSource("pdf")} />
                <span>Upload PDF</span>
              </label>

              <div className="imp-metrics mt-4">
                {pill("Multi-intent identification", meta.multi_intent ? "Yes" : "No")}
                {pill("Multi-lingual", meta.multi_lingual ? "Yes" : "No")}
                {pill("Sentiment Analysis", meta.sentiment || "Neutral")}
                {pill("Time Taken", meta.time_taken || "—")}
                {pill("Cost (USD)", `$${Number(meta.cost_usd || 0).toFixed(6)}`)}
                {pill("Model", meta.model || "—")}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button type="button" className="imp-btn px-4 py-2" onClick={reset}>
                  <RotateCcw size={16} className="mr-2 inline-block" />
                  Reset
                </button>

                <button
                  type="button"
                  className="imp-btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!canGenerate || loading}
                  onClick={generate}
                >
                  {loading ? "Generating..." : "Generate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="imp-card p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="imp-section-title">AI Response</div>

          <div className="flex items-center gap-2">
            <button type="button" className="imp-icon-btn" onClick={() => setEditing((v) => !v)} aria-label="Edit">
              <Edit size={16} />
            </button>
            <button type="button" className="imp-icon-btn" onClick={() => copyText(markdown)} aria-label="Copy">
              <Copy size={16} />
            </button>
          </div>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="space-y-3">
              <ShimmerBlock h={18} />
              <ShimmerBlock h={18} />
              <ShimmerBlock h={18} />
              <ShimmerBlock h={18} />
            </div>
          ) : editing ? (
            <textarea
              className="imp-textarea"
              rows={10}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="AI response will appear here..."
            />
          ) : (
            <div className="imp-markdown">
              {markdown ? <ReactMarkdown>{markdown}</ReactMarkdown> : <div className="text-sm text-[color:var(--muted)]">No response yet. Generate a summary to see output.</div>}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-xs text-[color:var(--muted)]">
            {activityId ? `Activity ID: ${activityId}` : " "}
          </div>

          <button
            type="button"
            className={"imp-approve-btn" + (approved ? " is-approved" : "")}
            onClick={approve}
            disabled={!activityId || !markdown || approved}
          >
            <CheckCircle2 size={16} />
            {approved ? "Approved" : "Approve the response"}
          </button>
        </div>
      </div>
    </div>
  );
}
