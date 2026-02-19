export function cookieOptions() {
  const secure = String(process.env.COOKIE_SECURE || "false") === "true";
  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}
