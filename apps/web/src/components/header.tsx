import { UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const onLogout = () => {
    try {
      logout();
      navigate("/login");
      toast.success("Pomyślnie wylogowano!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="bg-background border-b border-border">
      <header className="container mx-auto py-4 flex justify-between items-center">
        <a href="/">
          <img src="/logo.svg" className="h-8" alt="Logo" />
        </a>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
                <DropdownMenuItem onClick={onLogout}>
                  Wyloguj się
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
};
