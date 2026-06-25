import { Outlet } from "react-router-dom";
import { Header } from "./components/header";
import { Navbar } from "./components/navbar";

export function Layout() {
  return (
    <main className="h-full flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto py-8 flex gap-8">
        <aside>
          <Navbar />
        </aside>
        <section className="w-full">
          <Outlet />
        </section>
      </main>
    </main>
  );
}
