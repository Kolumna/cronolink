import * as React from "react";
import { Form, Field as FormischField, useForm } from "@formisch/react";
import type { SubmitHandler } from "@formisch/react";
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
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { useNavigate } from "react-router-dom";

const FormSchema = v.object({
  email: v.pipe(v.string(), v.email("Please enter a valid email address.")),
  password: v.pipe(
    v.string(),
    v.minLength(4, "Password must be at least 8 characters."),
  ),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    schema: FormSchema,
    initialInput: {
      email: "",
      password: "",
    },
  });

  const handleSubmit: SubmitHandler<typeof FormSchema> = async (output) => {
    setIsLoading(true);
    try {
      await login(output.email, output.password)
      toast.success("Pomyślnie zalogowano!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {" "}
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Zaloguj się</CardTitle>
          <CardDescription>
            Wprowadź swoje dane logowania, aby uzyskać dostęp do swojego konta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form of={form} id="login-form" onSubmit={handleSubmit}>
            <FieldGroup>
              <FormischField of={form} path={["email"]}>
                {(field) => (
                  <Field data-invalid={field.errors !== null}>
                    <FieldLabel htmlFor="login-form-email">Email</FieldLabel>
                    <Input
                      {...field.props}
                      id="login-form-email"
                      type="email"
                      value={field.input ?? ""}
                      aria-invalid={field.errors !== null}
                      placeholder="you@example.com"
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
              <FormischField of={form} path={["password"]}>
                {(field) => (
                  <Field data-invalid={field.errors !== null}>
                    <FieldLabel htmlFor="login-form-password">Hasło</FieldLabel>
                    <Input
                      {...field.props}
                      id="login-form-password"
                      type="password"
                      value={field.input ?? ""}
                      aria-invalid={field.errors !== null}
                      placeholder="••••••••"
                      autoComplete="current-password"
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
              form="login-form"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Spinner className="mr-2 h-4 w-4" />}
              {isLoading ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
