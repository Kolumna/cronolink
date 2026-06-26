import { apiFetch } from "@/api/httpClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const query = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await apiFetch("/api/projects", { method: "GET" });
      if (!res.ok) throw new Error("Nie udało się pobrać projektów");
      return res.json() as Promise<Project[]>;
    },
  });
  return (
    <>
      <h1 className="text-2xl font-bold">Panel główny</h1>
      <p className="mt-2 text-muted-foreground">Witaj w panelu głównym!</p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Ostatnie projekty</CardTitle>
          <CardContent>
            {query.data?.length ? (
              <ul className="flex flex-col gap-2 list-disc">
                {query.data.slice(0, 5).map((project) => (
                  <li key={project.id}>
                    <Link
                      to={`/projects/${project.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {project.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Brak projektów do wyświetlenia.</p>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
}
