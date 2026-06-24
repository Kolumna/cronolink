import { apiFetch, getAccessToken, setAccessToken } from "@/api/httpClient";
import { AuthContext } from "@/contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState } from "react";
import type { Status, User } from "./types";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  const tryRestoreSession = useCallback(async () => {
    const res = await apiFetch("/api/auth/refresh", { method: "POST" });

    if (!res.ok) {
      setAccessToken(null);
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    const data = await res.json();
    setAccessToken(data.accessToken);
    setUser(data.user);
    setStatus("authenticated");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void tryRestoreSession();
    }, 0);

    return () => clearTimeout(timer);
  }, [tryRestoreSession]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token || status !== "authenticated") return;

    const { exp } = jwtDecode<{ exp: number }>(token);
    const refreshInMs = exp * 1000 - Date.now() - 60_000;

    const timer = setTimeout(tryRestoreSession, Math.max(refreshInMs, 0));
    return () => clearTimeout(timer);
  }, [status, tryRestoreSession]);

  async function login(email: string, password: string) {
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error(
        "Login failed. Please check your credentials and try again.",
      );
    }

    const data = await res.json();

    setAccessToken(data.accessToken);
    setUser(data.user);
    setStatus("authenticated");
  }

  async function logout() {
    const res = await apiFetch("/api/auth/logout", { method: "POST" });
    if (!res.ok) {
      throw new Error("Logout failed. Please try again.");
    }
    
    setAccessToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }

  return (
    <AuthContext.Provider value={{ login, logout, user, status }}>
      {children}
    </AuthContext.Provider>
  );
};
