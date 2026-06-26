import { apiFetch } from "@/api/httpClient";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import type { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { UsersIcon } from "lucide-react";

const getRoleColor = (role: string) => {
  switch (role) {
    case "1":
      return "bg-red-100 text-red-800";
    case "0":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case "1":
      return "Administrator";
    case "0":
      return "Użytkownik";
    default:
      return "Nieznana rola";
  }
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "Imię",
    cell: (info) => info.getValue() || "Brak",
  },
  {
    accessorKey: "lastName",
    header: "Nazwisko",
    cell: (info) => info.getValue() || "Brak",
  },
  {
    accessorKey: "role",
    header: "Rola",
    cell: (info) => (
      <Badge className={getRoleColor(String(info.getValue()))}>
        {getRoleLabel(String(info.getValue())) || "Brak"}
      </Badge>
    ),
  },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "createdAt",
    header: "Utworzony",
    cell: (info) => new Date(info.getValue() as string).toLocaleString(),
  },
];

export default function Users() {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await apiFetch("/api/users", { method: "GET" });
      if (!res.ok) throw new Error("Nie udało się pobrać użytkowników");
      return res.json() as Promise<User[]>;
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

        {/* <Button variant="default" size="lg" asChild>
          <Link to="/projects/add">
            <PlusIcon />
            Dodaj Użytkownika
          </Link>
        </Button> */}
      </div>

      <div className="w-full mt-8">
        <DataTable columns={columns} data={query.data || []} />
      </div>
    </>
  );
}
