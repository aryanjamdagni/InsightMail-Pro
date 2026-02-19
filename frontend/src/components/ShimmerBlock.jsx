export default function ShimmerBlock({ className }) {
  return (
    <div className={`shimmer rounded-xl border border-[color:var(--line)] bg-black/5 dark:bg-white/5 ${className}`} />
  );
}
