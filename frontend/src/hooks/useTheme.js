import { useEffect, useState } from "react";

export function useTheme() {
  const [mode, setMode] = useState(() => localStorage.getItem("imp_theme") || "dark");

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("dark", "light");
    html.classList.add(mode);
    localStorage.setItem("imp_theme", mode);
  }, [mode]);

  return { mode, setMode, toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")) };
}
