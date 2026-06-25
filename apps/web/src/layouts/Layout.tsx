import { Outlet } from "react-router-dom";
import { Header } from "../components/header";

export function Layout() {
  return (
    <main className="h-full flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto py-8">
        <Outlet />
      </main>
    </main>
  );
}
