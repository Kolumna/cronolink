// features/onboarding/OnboardingModal.tsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/api/httpClient";
import { toast } from "sonner";

type OnboardingPayload = {
  firstName: string;
  lastName: string;
  newPassword: string;
};

async function completeOnboarding(payload: OnboardingPayload) {
  const res = await apiFetch("/api/auth/complete-onboarding", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Nie udało się zapisać danych.");
  }
}

export function OnboardingModal({ open }: { open: boolean }) {
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Konto zostało skonfigurowane!");
      // odśwież dane usera, żeby user.mustChangePassword / isProfileComplete się zaktualizowały
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: () => {
      toast.error("Coś poszło nie tak. Spróbuj ponownie.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Hasło musi mieć co najmniej 8 znaków.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Hasła nie są identyczne.");
      return;
    }

    mutation.mutate({ firstName, lastName, newPassword });
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Uzupełnij swoje konto</DialogTitle>
          <DialogDescription>
            To Twoje pierwsze logowanie. Ustaw imię, nazwisko i nowe hasło, aby
            kontynuować.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Imię</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nazwisko</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nowe hasło</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Powtórz hasło</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Zapisywanie..." : "Zapisz i kontynuuj"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}