import * as React from "react";
import { Form, Field as FormischField, reset, useForm } from "@formisch/react";
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

const FormSchema = v.object({
  email: v.pipe(v.string(), v.email("Please enter a valid email address.")),
  password: v.pipe(
    v.string(),
    v.minLength(4, "Password must be at least 8 characters."),
  ),
});

export function LoginForm() {
  const { login } = useAuth();

  const form = useForm({
    schema: FormSchema,
    initialInput: {
      email: "",
      password: "",
    },
  });

  const handleSubmit: SubmitHandler<typeof FormSchema> = async (output) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(output, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });

    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(output),
    });

    if (!res.ok) {
      const errorData = await res.json();
      toast.error(`Login failed: ${errorData.message}`);
      return;
    }

    const data = await res.json();

    console.log("Login successful:", data);

    login(data.token);
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Please enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} id="form-formisch-demo" onSubmit={handleSubmit}>
          <FieldGroup>
            <FormischField of={form} path={["email"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="form-formisch-demo-email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field.props}
                    id="form-formisch-demo-email"
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
                  <FieldLabel htmlFor="form-formisch-demo-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field.props}
                    id="form-formisch-demo-password"
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
          <Button type="button" variant="outline" onClick={() => reset(form)}>
            Reset
          </Button>
          <Button type="submit" form="form-formisch-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
