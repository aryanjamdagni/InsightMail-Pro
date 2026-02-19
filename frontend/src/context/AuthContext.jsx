import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  async function refresh() {
    try {
      const r = await api.get("/api/auth/me");
      setUser(r.data?.user || null);
    } catch {
      setUser(null);
    } finally {
      setBooting(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  const value = useMemo(() => ({
    user,
    booting,
    setUser,
    refresh,
    async login(email, password) {
      const r = await api.post("/api/auth/login", { email, password });
      setUser(r.data?.user || null);
      return r.data?.user;
    },
    async register(name, email, password) {
      const r = await api.post("/api/auth/register", { name, email, password });
      setUser(r.data?.user || null);
      return r.data?.user;
    },
    async logout() {
      await api.post("/api/auth/logout");
      setUser(null);
    },
  }), [user, booting]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
