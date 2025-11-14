import { Navigate } from "react-router-dom";

export default function PrivateRoutes({ children }) {
  const token = localStorage.getItem("access_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
