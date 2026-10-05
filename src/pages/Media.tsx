import { useEffect, useRef, useState } from "react";
import {
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
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
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage("Only JPEG, PNG, WEBP and GIF images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5MB.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/upload/image", formData);

      if (response.data?.success) {
        setMessage("Image uploaded successfully.");

        await fetchMedia();
      } else {
        setMessage("Image upload failed.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Failed to upload image.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

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
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Media
          </h1>

          <p className="mt-2 text-gray-600">
            Upload and manage your portfolio images.
          </p>
        </div>

        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload size={18} />

            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            message.includes("successfully")
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-600">
            Loading media...
          </p>
        </div>
      ) : media.length === 0 ? (
        /* Empty State */
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <ImageIcon
            size={48}
            className="mx-auto text-gray-400"
          />

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No media found
          </h2>

          <p className="mt-2 text-gray-500">
            Upload your first portfolio image.
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Upload size={18} />
            Upload Image
          </button>
        </div>
      ) : (
        /* Media Grid */
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
                    console.error(
                      "Image failed to load:",
                      item.url
                    );

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
                    {new Date(
                      item.createdAt
                    ).toLocaleDateString()}
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