import type { Status } from "@/providers/auth/types";
import type { User } from "@/types";
import { createContext } from "react";

type AuthContextValue = {
  user: User | null;
  status: Status;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
