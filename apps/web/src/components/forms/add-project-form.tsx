import type { SubmitHandler } from "@formisch/react";
import { Form, Field as FormischField, useForm } from "@formisch/react";
import * as React from "react";
import { toast } from "sonner";
import * as v from "valibot";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { apiFetch } from "@/api/httpClient";
import { Textarea } from "../ui/textarea";
import { useNavigate } from "react-router-dom";

const FormSchema = v.object({
  name: v.string(),
  description: v.optional(v.string()),
});

async function createProject(project: v.InferOutput<typeof FormSchema>) {
  const response = await apiFetch("/api/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    throw new Error("Nie udało się utworzyć projektu");
  }

  return response.json();
}

export function AddProjectForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (newProject: v.InferOutput<typeof FormSchema>) =>
      createProject(newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      toast.success("Pomyślnie dodano projekt!");
      navigate("/projects");
    },
    onError: (error) => {
      console.error("Coś poszło nie tak:", error);
      toast.error("Wystąpił błąd podczas dodawania projektu.");
    },
  });

  const form = useForm({
    schema: FormSchema,
    initialInput: {
      name: "",
      description: "",
    },
  });

  const handleSubmit: SubmitHandler<typeof FormSchema> = async (output) => {
    try {
      mutation.mutate({ name: output.name, description: output.description });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {" "}
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Dodaj Projekt</CardTitle>
          <CardDescription>
            Wprowadź nazwę swojego projektu, aby go dodać.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form of={form} id="add-project-form" onSubmit={handleSubmit}>
            <FieldGroup>
              <FormischField of={form} path={["name"]}>
                {(field) => (
                  <Field data-invalid={field.errors !== null}>
                    <FieldLabel htmlFor="add-project-form-name">
                      Nazwa Projektu
                    </FieldLabel>
                    <Input
                      {...field.props}
                      id="add-project-form-name"
                      type="text"
                      value={field.input ?? ""}
                      aria-invalid={field.errors !== null}
                      placeholder="Wprowadź nazwę projektu"
                      autoComplete="email"
                    />
                    {field.errors && (
                      <FieldError
                        errors={field.errors.map((message) => ({ message }))}
                      />
                    )}
                  </Field>
                )}
              </FormischField>
              <FormischField of={form} path={["description"]}>
                {(field) => (
                  <Field data-invalid={field.errors !== null}>
                    <FieldLabel htmlFor="add-project-form-description">
                      Opis
                    </FieldLabel>
                    <Textarea
                      {...field.props}
                      id="add-project-form-description"
                      value={field.input ?? ""}
                      aria-invalid={field.errors !== null}
                      placeholder="Wprowadź opis projektu"
                      autoComplete="email"
                    />
                    {field.errors && (
                      <FieldError
                        errors={field.errors.map((message) => ({ message }))}
                      />
                    )}
                  </Field>
                )}
              </FormischField>
            </FieldGroup>
          </Form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="submit"
              form="add-project-form"
              size="lg"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
              {mutation.isPending ? "Dodawanie projektu..." : "Dodaj Projekt"}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
