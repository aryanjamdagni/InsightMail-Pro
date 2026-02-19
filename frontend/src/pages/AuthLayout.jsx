import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoPng from "../assets/insightmailpro-logo.png";

export default function AuthLayout() {
  const { user, booting } = useAuth();
  const loc = useLocation();

  if (booting) return null;
  if (user) return <Navigate to="/app/dashboard" replace />;

  const isLogin = loc.pathname.includes("/auth/login");
  const title = isLogin ? "Login" : "Create account";
  const subtitle = isLogin ? "Log in to continue" : "Create your InsightMail Pro account";

  return (
    <div className="imp-shell">
      <div className="p-5 md:p-6 xl:p-7 space-y-4">
        <div className="imp-header relative">
          <div className="imp-header-inner">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={logoPng}
                alt="InsightMail Pro"
                className="h-7 w-auto select-none"
                draggable={false}
              />
              <div className="flex items-baseline gap-2 min-w-0">
                <div className="font-semibold truncate text-[15px]">
                  <span className="text-[color:var(--text)]">InsightMail</span>
                  <span className="text-[color:var(--p2)] font-bold">Pro</span>
                </div>
                <div className="text-[12px] text-[color:var(--muted)] truncate">
                  Authentication
                </div>
              </div>
            </div>

            <div className="text-center font-semibold text-[15px] text-[color:var(--text)]">
              {title}
            </div>

            <div className="flex items-center justify-end">
              <div className="text-[12px] text-[color:var(--muted)] font-medium">
                {subtitle}
              </div>
            </div>
          </div>
        </div>

        <div className="grid place-items-center">
          <div className="w-full max-w-lg imp-card p-6 md:p-7">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
