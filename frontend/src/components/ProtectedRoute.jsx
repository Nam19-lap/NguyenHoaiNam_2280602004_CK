import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
}
