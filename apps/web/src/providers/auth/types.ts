export type User = {
  id: string;
  email: string;
  role: string;
}

export type Status = "loading" | "authenticated" | "unauthenticated";