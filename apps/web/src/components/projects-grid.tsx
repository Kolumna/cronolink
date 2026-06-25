import { apiFetch } from "@/api/httpClient";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  CalendarIcon,
  EllipsisVertical,
  FolderCodeIcon,
  TrashIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

async function deleteProject(projectId: string): Promise<void> {
  const response = await apiFetch(`/api/projects/${projectId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Nie udało się usunąć projektu");
  }
  return;
}

export const ProjectGrid = ({ projects }: { projects: Project[] }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      toast.success("Pomyślnie usunięto projekt!");
    },
    onError: (error) => {
      console.error("Coś poszło nie tak:", error);
      toast.error("Wystąpił błąd podczas usuwania projektu.");
    },
  });
  return (
    <div>
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {projects.map((project) => (
            <Link to={`/projects/${project.id}`} key={project.id}>
              <Card
                key={project.id}
                className="hover:bg-muted transition-all duration-300 h-42"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {project.name}{" "}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <EllipsisVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              mutation.mutate(project.id);
                            }}
                          >
                            <TrashIcon /> Usuń
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardTitle>
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </CardHeader>
                <CardFooter className="mt-auto">
                  <div className="flex items-center gap-1.5 w-full">
                    <CalendarIcon size={16} />
                    <small>
                      Utworzono:{" "}
                      {new Date(project.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Empty className="border border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderCodeIcon />
            </EmptyMedia>
            <EmptyTitle>Brak projektów</EmptyTitle>
            <EmptyDescription>
              Nie masz jeszcze żadnych projektów. Utwórz nowy projekt lub
              zaimportuj istniejący, aby rozpocząć pracę.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
              <Link to="/projects/add"><Button>Utwórz Projekt</Button></Link>
          </EmptyContent>
          <Button
            variant="link"
            asChild
            className="text-muted-foreground"
            size="sm"
          >
            <a href="#">
              Dowiedz się więcej <ArrowUpRightIcon />
            </a>
          </Button>
        </Empty>
      )}
    </div>
  );
};
