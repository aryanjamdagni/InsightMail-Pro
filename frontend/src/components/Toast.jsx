import { AnimatePresence, motion } from "framer-motion";

export default function Toast({ items, onRemove }) {
  return (
    <div className="fixed right-5 top-5 z-[99999] space-y-3">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="imp-card px-4 py-3 min-w-[280px] max-w-[360px]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{t.title}</div>
                {t.message ? (
                  <div className="mt-0.5 text-xs text-[color:var(--muted)]">{t.message}</div>
                ) : null}
              </div>

              <button
                className="imp-btn h-8 w-8 grid place-items-center"
                onClick={() => onRemove(t.id)}
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
