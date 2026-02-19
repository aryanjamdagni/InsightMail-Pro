import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function money(n) {
  const v = Number(n || 0);
  return `$${v.toFixed(6)}`;
}

function userLabel(name, email) {
  const n = String(name || "").trim();
  if (n) return n;
  const e = String(email || "").trim();
  if (!e) return "User";
  return e.split("@")[0] || "User";
}

function initials(nameOrEmail) {
  const s = String(nameOrEmail || "").trim();
  if (!s) return "U";
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (s.includes("@")) return s.split("@")[0].slice(0, 2).toUpperCase();
  return s.slice(0, 2).toUpperCase();
}

export default function Usage() {
  const [entries, setEntries] = useState([]);
  const [totalsByUser, setTotalsByUser] = useState([]);
  const [q, setQ] = useState("");

  async function load() {
    const r = await api.get("/api/usage");
    setEntries(r.data?.entries || []);
    setTotalsByUser(r.data?.totalsByUser || []);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return entries;
    return entries.filter((x) =>
      [
        x.userName,
        x.userEmail,
        x.process,
        x.model,
        x.tokensIn,
        x.tokensOut,
        x.costUSD,
      ]
        .map((v) => String(v ?? ""))
        .join(" ")
        .toLowerCase()
        .includes(s)
    );
  }, [entries, q]);

  const totalAll = useMemo(() => {
    if (totalsByUser?.length) return totalsByUser.reduce((a, b) => a + Number(b.costUSD || 0), 0);
    return entries.reduce((a, b) => a + Number(b.costUSD || 0), 0);
  }, [totalsByUser, entries]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="imp-card imp-section-tight">
          <div className="imp-kicker">Total cost</div>
          <div className="mt-2 text-2xl font-semibold">{money(totalAll)}</div>
        </div>

        <div className="imp-card imp-section-tight col-span-2">
          <div className="imp-kicker">Total by user</div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {totalsByUser.slice(0, 8).map((u) => {
              const name = userLabel(u.userName, u.userEmail);
              const email = String(u.userEmail || "");
              return (
                <div key={email || name} className="imp-input px-3 py-2 text-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full border border-[color:var(--line)] bg-white/10 grid place-items-center font-semibold">
                      {initials(name || email)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold truncate max-w-[240px]">{name}</div>
                      <div className="text-[11px] text-[color:var(--muted)] truncate max-w-[260px]">{email}</div>
                    </div>
                  </div>

                  <div className="font-semibold whitespace-nowrap">{money(u.costUSD)}</div>
                </div>
              );
            })}

            {!totalsByUser?.length && (
              <div className="text-[color:var(--muted)]">No usage yet.</div>
            )}
          </div>
        </div>
      </div>

      <div className="imp-card imp-section-tight">
        <div className="imp-title mb-3">Search</div>
        <input
          className="w-full imp-input px-4 py-3 text-sm outline-none"
          placeholder="Search by user/process/model..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="imp-card p-0 overflow-x-auto scrollbar">
        <table className="imp-table min-w-[1050px]">
          <thead>
            <tr>
              <th>When</th>
              <th>User</th>
              <th>Process</th>
              <th>Model</th>
              <th>Tokens In</th>
              <th>Tokens Out</th>
              <th>Cost</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((x) => {
              const name = userLabel(x.userName, x.userEmail);
              const email = String(x.userEmail || "");
              return (
                <tr
                  key={x._id}
                  className="border-t border-[color:var(--line)] hover:bg-black/5 dark:hover:bg-white/5 transition"
                >
                  <td className="whitespace-nowrap">{new Date(x.createdAt).toLocaleString()}</td>

                  <td className="">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full border border-[color:var(--line)] bg-white/10 grid place-items-center font-semibold">
                        {initials(name || email)}
                      </div>

                      <div className="min-w-0">
                        <div className="font-semibold truncate max-w-[240px]">{name}</div>
                        <div className="text-[11px] text-[color:var(--muted)] truncate max-w-[260px]">{email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap">{x.process || "—"}</td>
                  <td className="whitespace-nowrap">{x.model || "—"}</td>
                  <td className="whitespace-nowrap">{x.tokensIn ?? "—"}</td>
                  <td className="whitespace-nowrap">{x.tokensOut ?? "—"}</td>
                  <td className="whitespace-nowrap font-semibold">{money(x.costUSD)}</td>
                </tr>
              );
            })}

            {!filtered.length && (
              <tr>
                <td colSpan={7} className="text-[color:var(--muted)]">
                  No usage entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
