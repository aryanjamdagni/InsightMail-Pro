import { Menu } from "lucide-react";

export default function TopBar({ title, onOpenMobileNav }) {
  return (
    <div className="imp-topbar">
      <div className="imp-topbar-inner">
        <button type="button" className="imp-icon-btn md:hidden" onClick={onOpenMobileNav} aria-label="Open menu">
          <Menu size={18} />
        </button>
        <div className="flex-1 text-center md:text-left font-semibold text-[15px] text-[color:var(--text)]">
          {title}
        </div>
        <div className="w-8 md:hidden" />
      </div>
    </div>
  );
}
