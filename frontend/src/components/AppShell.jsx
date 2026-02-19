import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Toast from "./Toast";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

export default function AppShell() {
  const toast = useToast();
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [dark, setDark] = useState(() => {
    try {
      const v = localStorage.getItem("imp_theme");
      if (v === "dark") return true;
      if (v === "light") return false;
    } catch {}
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", !!dark);
    try {
      localStorage.setItem("imp_theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);

  const title = useMemo(() => {
    if (loc.pathname.includes("/app/history")) return "History";
    if (loc.pathname.includes("/app/usage")) return "Usage";
    return "Smart Email Summarizer";
  }, [loc.pathname]);

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [loc.pathname]);

  async function doLogout() {
    await logout?.();
    nav("/auth/login", { replace: true });
  }

  return (
    <div className="imp-layout">
      <div className="hidden md:block">
        <Sidebar user={user} dark={dark} onToggleTheme={() => setDark(v => !v)} onLogout={doLogout} />
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="md:hidden fixed inset-0 z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <motion.div
              className="absolute left-0 top-0 h-full w-[320px]"
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Sidebar user={user} dark={dark} onToggleTheme={() => setDark(v => !v)} onLogout={doLogout} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="imp-main">
        <div className="p-5 md:p-6 xl:p-7 space-y-4">
          <TopBar title={title} onOpenMobileNav={() => setMobileOpen(true)} />
          <div className="space-y-4">
            <Outlet context={{ toast }} />
          </div>
        </div>
      </div>

      <Toast items={toast.items} onRemove={toast.remove} />
    </div>
  );
}
