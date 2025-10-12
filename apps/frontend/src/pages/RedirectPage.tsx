import { API_BASE_URL } from "@/constants";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function RedirectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) {
      navigate("/");
    }
    window.location.href = `${API_BASE_URL}/url/${id}`;
  }, [id]);
  return (
    <div className="z-100 relative min-h-screen w-full flex justify-center items-center text-xl text-white">
      Redirecting...
    </div>
  );
}

export default RedirectPage;
