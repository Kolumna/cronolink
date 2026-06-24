import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const { status } = useAuth();

  console.log(status);

  if (status === "loading")
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  if (status === "unauthenticated") return <Navigate to="/login" replace />;
  return <Outlet />;
}
