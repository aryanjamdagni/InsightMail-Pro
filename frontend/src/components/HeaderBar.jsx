import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import api from "../services/api";
import MenuDropdown from "./MenuDropdown";
import logoPng from "../assets/insightmailpro-logo.png";

export default function HeaderBar({ user, onToggleTheme }) {
  const nav = useNavigate();
  const loc = useLocation();

  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);

  const title = useMemo(() => {
    if (loc.pathname.includes("/app/history")) return "History";
    if (loc.pathname.includes("/app/usage")) return "Usage";
    return "Smart Email Summarizer";
  }, [loc.pathname]);

  const displayName = useMemo(() => {
    const n = String(user?.name || "").trim();
    if (n) return n;
    const e = String(user?.email || "").trim();
    if (e.includes("@")) return e.split("@")[0];
    return "User";
  }, [user]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onDocDown(e) {
      if (!open) return;
      const root = rootRef.current;
      if (!root) return;
      if (root.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [open]);

  async function logout() {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setOpen(false);
      nav("/auth/login", { replace: true });
    }
  }

  return (
    <div className="imp-header relative" ref={rootRef}>
      <div className="imp-header-inner">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <button
              type="button"
              className="imp-icon-btn"
              onClick={() => setOpen((v) => !v)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <MenuDropdown
              open={open}
              onClose={() => setOpen(false)}
              onToggleTheme={onToggleTheme}
              onNavigate={(path) => {
                setOpen(false);
                nav(path);
              }}
              onLogout={logout}
            />
          </div>

          <div className="flex items-center gap-3 min-w-0">
            <img
              src={logoPng}
              alt="InsightMail Pro"
              className="h-7 w-auto select-none"
              draggable={false}
            />

            <div className="flex items-baseline gap-2 min-w-0">
              <div className="font-semibold truncate text-[15px]">
                <span className="text-[color:var(--text)]"></span>
                <span className="text-[color:var(--p2)] font-bold"></span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center font-semibold text-[15px] text-[color:var(--text)]">
          {title}
        </div>

        <div className="flex items-center gap-3 justify-end">
          <div className="h-10 w-10 rounded-full border border-[color:var(--line)] bg-black/5 dark:bg-white/5" />
          <div className="leading-tight text-right">
            <div className="text-[13px] font-semibold text-[color:var(--text)]">
              {displayName}
            </div>
            <div className="text-[12px] text-[color:var(--muted)]">
              {user?.email || ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

