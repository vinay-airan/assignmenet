import { Navigate } from "react-router-dom";

export default function GuardedRoute({ children }) {
  const hasToken = Boolean(localStorage.getItem("forge_token"));
  return hasToken ? children : <Navigate to="/login" replace />;
}
