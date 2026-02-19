export default function StatCard({ label, value, highlight }) {
  return (
    <div className="neo-card rounded-[26px] px-10 py-10">
      <div className="text-xs tracking-[0.25em] text-[color:var(--muted)] font-semibold">
        {label}
      </div>
      <div className={`mt-5 text-6xl font-extrabold ${highlight ? "text-emerald-400" : "text-[color:var(--text)]"}`}>
        {value}
      </div>
    </div>
  );
}
