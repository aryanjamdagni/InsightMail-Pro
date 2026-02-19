import { AnimatePresence, motion } from "framer-motion";

export default function SidePanel({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 z-[9998] bg-black/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) onClose?.();
            }}
          />

          <motion.div
            className="fixed right-0 top-0 z-[9999] h-full w-[560px] max-w-[92vw]"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <div className="h-full imp-card rounded-none border-l border-[color:var(--line)]">
              <div className="px-5 py-4 flex items-center justify-between border-b border-[color:var(--line)]">
                <div className="text-sm font-semibold">{title}</div>
                <button className="imp-btn h-10 w-10 grid place-items-center" onClick={onClose}>
                  ✕
                </button>
              </div>

              <div className="h-[calc(100%-64px)] overflow-auto scrollbar px-5 py-4">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
