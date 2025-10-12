import { BASE_URL } from "@/constants";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface Url {
  id: string;
  redirectURL: string;
}

const shorten = (url: string): string => {
  return url.length > 40 ? url.slice(0, 40) + "..." : url;
};

export function RecentLinks({ urls }: { urls: Url[] }) {
  return (
    <div className="bg-white flex flex-col gap-4 rounded-lg w-full max-w-4xl p-4 sm:p-6 shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold tracking-tight">Recent Links</h2>
        <Link
          to="/analytics"
          className="text-gray-400 text-sm hover:underline hover:text-gray-600 transition"
        >
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {urls.map((url) => (
          <div
            key={url.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded-lg p-3 hover:bg-gray-50 hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 text-blue-600 font-medium break-all">
              <a
                href={`${BASE_URL}/${url.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {`${BASE_URL}/${url.id}`}
              </a>
              <ExternalLink size={16} className="text-gray-500 shrink-0" />
            </div>
            <div className="text-gray-400 text-sm mt-1 sm:mt-0 w-full sm:w-auto">
              {shorten(url.redirectURL)}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {urls.length === 0 && (
          <p className="text-gray-400 text-center text-sm">No links yet.</p>
        )}
      </div>
    </div>
  );
}
