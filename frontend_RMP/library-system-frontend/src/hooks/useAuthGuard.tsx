import { useAppSelector } from "@/store/hooks";
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

export function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
