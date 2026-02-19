import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="text-lg font-semibold text-[color:var(--text)]">Welcome back</div>
        <div className="mt-1 text-sm text-[color:var(--muted)]">
          Log in to continue to InsightMail Pro
        </div>
      </div>

      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <div className="text-xs tracking-[0.25em] text-[color:var(--muted)] font-semibold">
            EMAIL
          </div>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="mt-2 w-full imp-input px-4 py-3 text-sm outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <div className="text-xs tracking-[0.25em] text-[color:var(--muted)] font-semibold">
            PASSWORD
          </div>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="mt-2 w-full imp-input px-4 py-3 text-sm outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {err && <div className="text-sm text-rose-600">{err}</div>}

        <button className="w-full imp-btn-primary py-3 text-sm font-semibold">
          Login
        </button>
      </form>

      <div className="text-sm text-[color:var(--muted)]">
        New here?{" "}
        <Link className="imp-link font-semibold" to="/auth/signup">
          Create an account
        </Link>
      </div>
    </div>
  );
}

