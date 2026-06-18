import { useEffect, useState } from "react";
import { LoginForm } from "./components/forms/login-form";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user, token } = useAuth();
  console.log(user)
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
      {projects.length > 0 && <pre>{JSON.stringify(projects, null, 2)}</pre>}
      <LoginForm />
    </main>
  );
}

export default App;
