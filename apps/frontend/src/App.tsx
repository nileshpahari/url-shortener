import { Navbar } from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { Container } from "./components/Container";
import { useAuth } from "./hooks/useAuth";
import { LoaderCircle } from "lucide-react";

function App() {
  const { authLoading } = useAuth();
  return (
    <Container>
      <Navbar />
      <main>
        {authLoading ? (
          <div className="z-100 min-h-screen w-full flex justify-center items-center text-white">
            <LoaderCircle className="animate-spin "></LoaderCircle>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </Container>
  );
}

export default App;
