import { Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../hooks/useauth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAuth();
  const hasToken = typeof window !== "undefined" && Boolean(localStorage.getItem("access_token"));

  if (!token && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
}

export default ProtectedRoute;
