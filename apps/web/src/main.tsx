import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import App from "./App.tsx";
import { Providers } from "./providers/index.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <App />
      <Toaster position="top-center" />
    </Providers>
  </StrictMode>,
);
