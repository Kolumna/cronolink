import Login from "@/pages/Login";
import { AuthProvider } from "@/providers/auth/AuthProvider";
import { ProtectedRoute } from "@/providers/auth/routes/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import { AddProjectForm } from "./components/forms/add-project-form";
import { Layout } from "./Layout";
import Users from "./pages/Users";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/add" element={<AddProjectForm />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
