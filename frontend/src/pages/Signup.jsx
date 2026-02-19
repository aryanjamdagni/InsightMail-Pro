import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await register(name, email, password);
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="text-lg font-semibold text-[color:var(--text)]">Create your account</div>
        <div className="mt-1 text-sm text-[color:var(--muted)]">
          Join InsightMail Pro in less than a minute
        </div>
      </div>

      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <div className="text-xs tracking-[0.25em] text-[color:var(--muted)] font-semibold">
            NAME
          </div>
          <input
            autoComplete="name"
            placeholder="Your name"
            className="mt-2 w-full imp-input px-4 py-3 text-sm outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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
            autoComplete="new-password"
            placeholder="Create a strong password"
            className="mt-2 w-full imp-input px-4 py-3 text-sm outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {err && <div className="text-sm text-rose-600">{err}</div>}

        <button className="w-full imp-btn-primary py-3 text-sm font-semibold">
          Create account
        </button>
      </form>

      <div className="text-sm text-[color:var(--muted)]">
        Already have an account?{" "}
        <Link className="imp-link font-semibold" to="/auth/login">
          Login
        </Link>
      </div>
    </div>
  );
}
