import { NavLink } from "react-router-dom";
import { LayoutDashboard, History, DollarSign, LogOut, Moon, Sun, Settings, LifeBuoy } from "lucide-react";
import logoPng from "../assets/insightmailpro-logo.png";
import { motion } from "framer-motion";

function Item({ to, icon: Icon, children, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "imp-side-item",
          isActive ? "imp-side-item-active" : "",
        ].join(" ")
      }
    >
      <Icon size={18} />
      <span className="truncate">{children}</span>
    </NavLink>
  );
}

export default function Sidebar({ user, dark, onToggleTheme, onLogout }) {
  const isAdmin = user?.role === "admin";

  return (
    <div className="imp-sidebar">
      <div className="imp-side-top">
        <div className="flex items-center gap-3">
          <img src={logoPng} alt="InsightMail Pro" className="h-8 w-auto select-none" draggable={false} />
        </div>
      </div>

      <div className="imp-side-nav">
        <Item to="/app/dashboard" end icon={LayoutDashboard}>Dashboard</Item>
        <Item to="/app/history" icon={History}>History</Item>
        {isAdmin ? <Item to="/app/usage" icon={DollarSign}>Usage</Item> : null}

        <div className="imp-side-divider" />

        <div className="imp-side-muted">
          <div className="imp-side-muted-title">More</div>
          <div className="grid gap-1">
            <button type="button" className="imp-side-item imp-side-item-disabled">
              <Settings size={18} />
              <span>Settings</span>
            </button>
            <button type="button" className="imp-side-item imp-side-item-disabled">
              <LifeBuoy size={18} />
              <span>Help & Support</span>
            </button>
          </div>
        </div>
      </div>

      <div className="imp-side-bottom">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[color:var(--muted)]">
            {dark ? <Moon size={14} /> : <Sun size={14} />}
            <span>Dark Mode</span>
          </div>
          <button className={"imp-toggle" + (dark ? " is-on" : "")} type="button" onClick={onToggleTheme} aria-label="Toggle theme" />
        </div>

        <motion.button
          type="button"
          className="imp-side-logout"
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </motion.button>

        <div className="mt-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-[color:var(--line)] bg-black/5 dark:bg-white/5" />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-[color:var(--text)] truncate">
              {user?.name || "User"}
            </div>
            <div className="text-[12px] text-[color:var(--muted)] truncate">
              {user?.email || ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
