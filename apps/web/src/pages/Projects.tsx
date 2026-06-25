import { apiFetch } from "@/api/httpClient";
import { ProjectGrid } from "@/components/projects-grid";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { CuboidIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Projects() {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CuboidIcon />
            Projekty
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tutaj możesz zarządzać swoimi projektami.
          </p>
        </div>

        <Button onClick={() => {}} variant="default" size="lg" asChild>
          <Link to="/projects/add">
            <PlusIcon />
            Dodaj Projekt
          </Link>
        </Button>
      </div>

      {!query.isPending ? (
        <div className="w-full mt-8">
          <ProjectGrid projects={query.data || []} />
        </div>
      ) : (
        <span>Ładowanie...</span>
      )}
    </>
  );
}
