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
  githubUrl?: string;
  startedAt?: string;
  finishedAt?: string;
  passwords: ProjectPassword[];
  createdAt: string;
  updatedAt: string;
}

type ProjectPassword = {
  name: string;
  value: string;
}