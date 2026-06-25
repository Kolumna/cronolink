import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import { AuthProvider } from "@/providers/auth/AuthProvider";
import { ProtectedRoute } from "@/providers/auth/routes/ProtectedRoute";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./layouts/Layout";
import AddProject from "./pages/AddProject";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import { DashboardLayout } from "./layouts/DashboardLayout";
import Project from "./pages/Project";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route element={<Layout />}>
              <Route path="/projects/add" element={<AddProject />} />
              <Route path="/projects/:id" element={<Project />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
