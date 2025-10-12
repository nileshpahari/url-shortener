import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate()
  const handleLogout = async () => {
    await logout();
    navigate("/login")
  };
  return (
    <nav className="bg-white w-full shadow-sm fixed z-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-gray-800 hover:text-gray-600 transition"
        >
          Shortly
        </Link>

        <div>
          {user ? (
            <span
              onClick={handleLogout}
              className="text-gray-700 font-medium border border-gray-300 rounded-lg px-4 py-1.5 hover:bg-gray-100 transition cursor-pointer"
            >
              Logout
            </span>
          ) : (
            <Link
              to="/login"
              className="text-gray-700 font-medium border border-gray-300 rounded-lg px-4 py-1.5 hover:bg-gray-100 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
