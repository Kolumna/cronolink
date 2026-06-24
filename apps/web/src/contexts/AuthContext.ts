import { createContext } from 'react';
type User = { id: string; email: string; role: string };

type AuthContextValue = {
  user: User | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
