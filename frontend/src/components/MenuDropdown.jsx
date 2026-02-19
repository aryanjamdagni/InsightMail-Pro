import { AnimatePresence, motion } from "framer-motion";

export default function MenuDropdown({ open, onClose, onNavigate, onToggleTheme, onLogout }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute left-0 top-full mt-2 z-[90] w-[320px]"
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.14 }}
        >
          <div className="imp-card-solid p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-[color:var(--text)]">Menu</div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-[color:var(--muted)]">Dark Mode</div>
                <button
                  className="imp-toggle"
                  type="button"
                  onClick={() => onToggleTheme?.()}
                  aria-label="Toggle theme"
                />
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <button
                className="imp-menu-item"
                onClick={() => {
                  onClose?.();
                  onNavigate?.("/app/dashboard");
                }}
              >
                Dashboard
              </button>

              <button
                className="imp-menu-item"
                onClick={() => {
                  onClose?.();
                  onNavigate?.("/app/history");
                }}
              >
                History
              </button>

              <button
                className="imp-menu-item"
                onClick={() => {
                  onClose?.();
                  onNavigate?.("/app/usage");
                }}
              >
                Cost Analysis
              </button>

              <button
                className="imp-menu-item imp-menu-item-danger"
                onClick={async () => {
                  onClose?.();
                  await onLogout?.();
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
