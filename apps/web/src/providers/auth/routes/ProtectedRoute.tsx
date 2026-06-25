import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const { status } = useAuth();
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    let timer = null;

    if (status === "loading") {
      timer = setTimeout(() => {
        setIsTimeout(true);
      }, 10000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [status]);

  if (status === "loading")
    return (
      <div className="flex flex-col h-screen w-screen items-center justify-center">
        <Spinner className="size-8" />
        {isTimeout && (
          <div className="flex mt-8 flex-col items-center justify-center gap-4 text-center">
            <p className="font-medium">
              Serwer nie odpowiada. Sprawdź połączenie lub spróbuj ponownie
              później.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Odśwież
            </Button>
          </div>
        )}
      </div>
    );
  if (status === "unauthenticated") return <Navigate to="/login" replace />;
  return <Outlet />;
}
