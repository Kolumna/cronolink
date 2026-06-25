import { AddProjectForm } from "@/components/forms/add-project-form";

export default function AddProject() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Dodaj Projekt
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tutaj możesz dodać nowy projekt.
        </p>
      </div>

      <AddProjectForm />
    </div>
  );
}
