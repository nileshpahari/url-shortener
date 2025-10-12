import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle as Loader } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/constants";
import { RecentLinks } from "@/components/RecentLinks";

export default function ShortenerPage() {
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [urls, setUrls] = useState([]);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value.trim()) return;

    try {
      setSubmitting(true);
      const res = await axios.post(`${API_BASE_URL}/url/create`, { redirectURL: value });
      const id = res.data.url.id;

      if (!user) {
        let storage = JSON.parse(localStorage.getItem("urls") || "[]");
        storage = [{ id, redirectURL: value }, ...storage].slice(0, 3);
        localStorage.setItem("urls", JSON.stringify(storage));
      }

      fetchUrls();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
      setValue("");
    }
  };

  const fetchUrls = async () => {
    try {
      if (user) {
        const res = await axios.get(`${API_BASE_URL}/url/all`);
        setUrls(res.data.urls.slice(0, 3));
      } else {
        const data = JSON.parse(localStorage.getItem("urls") || "[]");
        setUrls(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [user]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-10 z-10 relative">
      <div className="flex flex-col items-center justify-center gap-10 w-full max-w-4xl mx-auto">
        {/* Shorten Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full p-6 rounded-xl shadow-lg flex flex-col sm:flex-row gap-3"
        >
          <Input
            type="text"
            placeholder="https://example.com/very/long/path?id=2"
            value={value}
            disabled={submitting}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 text-base"
          />
          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto flex justify-center items-center gap-2"
          >
            {submitting ? <Loader className="animate-spin h-4 w-4" /> : "Shorten"}
          </Button>
        </form>

        {/* Recent Links */}
        <RecentLinks urls={urls} />
      </div>
    </div>
  );
}
