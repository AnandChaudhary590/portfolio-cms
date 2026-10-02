import { useEffect, useState } from "react";
import { Copy, ExternalLink, Image as ImageIcon } from "lucide-react";
import api from "../services/api";

interface Media {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

const Media = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      const response = await api.get("/media");
      setMedia(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopyUrl = async (item: Media) => {
    try {
      await navigator.clipboard.writeText(item.url);

      setCopiedId(item.id);

      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Media
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your uploaded portfolio images.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-600">
            Loading media...
          </p>
        </div>
      ) : media.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <ImageIcon
            size={40}
            className="mx-auto text-gray-400"
          />

          <p className="mt-4 text-gray-500">
            No media found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="aspect-video bg-gray-100">
                <img
  src={item.url}
  alt={item.originalName}
  className="block h-full w-full object-cover"
  onError={(e) => {
    console.error("Image failed to load:", item.url);
    e.currentTarget.style.display = "none";
  }}
/>
              </div>

              <div className="p-5">
                <h3
                  className="truncate font-semibold text-gray-900"
                  title={item.originalName}
                >
                  {item.originalName}
                </h3>

                <div className="mt-2 space-y-1 text-xs text-gray-500">
                  <p>
                    Type: {item.mimeType}
                  </p>

                  <p>
                    Size: {formatFileSize(item.size)}
                  </p>

                  <p>
                    Uploaded:{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleCopyUrl(item)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Copy size={16} />

                    {copiedId === item.id
                      ? "Copied!"
                      : "Copy URL"}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-lg bg-gray-900 px-3 py-2 text-white hover:bg-gray-800"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Media;