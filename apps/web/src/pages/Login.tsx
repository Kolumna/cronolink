import { Footer } from "@/components/footer";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-12">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <img src="/logo.svg" alt="Logo" className="h-10" />
          </a>
          <LoginForm />
        </div>
      </div>
      <Footer />
    </div>
  );
}
