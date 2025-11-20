import { Navigate } from "react-router-dom";

export default function ManagerRoutes({ children }) {
  const token = localStorage.getItem("access_token");
  if (!token) return <Navigate to="/login" replace />;

  const raw = localStorage.getItem("user");
  const me = raw ? JSON.parse(raw) : null;
  const isManager = me?.role === "manager";

  if (!isManager) return <Navigate to="/home" replace />;
  return children;
}
