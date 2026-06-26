import { apiFetch } from "@/api/httpClient";
import { EditProjectForm } from "@/components/forms/edit-project-form";
import type { Project } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function EditProject() {
  const { id } = useParams();

  const query = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const res = await apiFetch(`/api/projects/${id}`, { method: "GET" });
      if (!res.ok) throw new Error("Nie udało się pobrać projektu");
      return res.json() as Promise<Project>;
    },
  });

  if (query.isPending) {
    return <div>Ładowanie...</div>;
  }

  if (!query.data) {
    return <div>Nie znaleziono projektu</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Edytuj Projekt
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tutaj możesz edytować istniejący projekt.
        </p>
      </div>

      <EditProjectForm project={query.data} />
    </div>
  );
}
