import { AuthContext } from "@/contexts/AuthContext";
import { useState } from "react";

function parseJwt(token: string) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("cronolink_token");
    return storedToken || null;
  });

  const login = (newToken: string) => {
    localStorage.setItem("cronolink_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("cronolink_token");
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isAuthenticated, user: token ? parseJwt(token) : null }}
    >
      {children}
    </AuthContext.Provider>
  );
};
