import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Protected({ roles }) {
  const { user, booting } = useAuth();
  if (booting) return null;
  if (!user) return <Navigate to="/auth/login" replace />;
  if (roles?.length && !roles.includes(user.role)) return <Navigate to="/app/dashboard" replace />;
  return <Outlet />;
}
