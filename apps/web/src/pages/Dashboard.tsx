import { Header } from "@/components/header";
import { Navbar } from "@/components/navbar";

export default function Dashboard() {
  return (
    <main className="h-full flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto py-8 flex gap-8">
        <aside>
          <Navbar />
        </aside>
        <section>
          <h1 className="text-2xl font-bold">Panel główny</h1>
          <p className="mt-2 text-muted-foreground">Witaj w panelu głównym!</p>
        </section>
      </main>
    </main>
  );
}
