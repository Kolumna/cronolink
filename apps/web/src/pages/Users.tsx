import { apiFetch } from "@/api/httpClient";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { CuboidIcon, PlusIcon, UsersIcon } from "lucide-react";
import { Link } from "react-router-dom";

type Project = {
  id: string;
  name: string;
  createdAt: string;
};

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Button variant="link" asChild>
        <Link to={`/projects/${row.original.id}`}>{row.original.name}</Link>
      </Button>
    ),
  },
  { accessorKey: "createdAt", header: "Created At" },
];

export default function Users() {
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
            <UsersIcon />
            Użytkownicy
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tutaj możesz zarządzać swoimi użytkownikami.
          </p>
        </div>

        <Button variant="default" size="lg" asChild>
          <Link to="/projects/add">
            <PlusIcon />
            Dodaj Projekt
          </Link>
        </Button>
      </div>

      <div className="w-full mt-8">
        <DataTable columns={columns} data={query.data || []} />
      </div>
    </>
  );
}
