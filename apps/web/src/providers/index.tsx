import { AuthProvider } from "./auth/AuthProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
