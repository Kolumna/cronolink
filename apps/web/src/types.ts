export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}