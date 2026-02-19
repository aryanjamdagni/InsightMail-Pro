import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "../services/api";

export default function AppMenu({ open, onClose }) {
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    const onClick = (e) => {
      const el = e.target;
      if (el?.dataset?.menuOverlay === "1") onClose?.();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [onClose]);

  async function logout() {
    try {
      await api.post("/api/auth/logout");
    } finally {
      localStorage.removeItem("user");
      onClose?.();
      nav("/login");
    }
  }

  const item = (to, label) => {
    const active = loc.pathname === to;
    return (
      <Link
        to={to}
        onClick={onClose}
        className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
          active ? "bg-white/10" : "hover:bg-white/10"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            data-menu-overlay="1"
            className="fixed inset-0 z-[9998] bg-black/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed z-[9999] left-6 top-[78px] w-[320px] rounded-2xl border border-[color:var(--line)] shadow-2xl"
            style={{
              background: "var(--cardSolid)",
              backdropFilter: "blur(18px)",
            }}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
          >
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Menu</div>

              <label className="flex items-center gap-2 text-xs text-[color:var(--muted)]">
                <span>Dark Mode</span>
                <input
                  type="checkbox"
                  className="h-4 w-8"
                  onChange={() => document.documentElement.classList.toggle("dark")}
                />
              </label>
            </div>

            <div className="px-2 pb-2 space-y-1">
              {item("/app/dashboard", "Dashboard")}
              {item("/app/history", "History")}
              {item("/app/usage", "Cost Analysis")}
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
