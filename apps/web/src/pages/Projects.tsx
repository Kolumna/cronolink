import { Header } from "@/components/header";
import { Navbar } from "@/components/navbar";

export default function Projects() {
  return (
    <main>
      <Header />
      <main className="container mx-auto py-8 flex gap-8">
        <aside>
          <Navbar />
        </aside>
        <section>
          <h1 className="text-2xl font-bold">Projekty</h1>
          <p className="mt-2 text-muted-foreground">
            Tutaj możesz zarządzać swoimi projektami.
          </p>
        </section>
      </main>
    </main>
  );
}
