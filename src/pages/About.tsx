import { useEffect, useState } from "react";
import api from "../services/api";

interface AboutData {
  id?: string;
  title: string;
  description: string;
  profileImage: string;
  resumeUrl: string;
}

const About = () => {
  const [form, setForm] = useState<AboutData>({
    title: "",
    description: "",
    profileImage: "",
    resumeUrl: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await api.get("/about");

        const about = response.data?.data;

        if (about) {
          setForm({
            id: about.id,
            title: about.title || "",
            description: about.description || "",
            profileImage: about.profileImage || "",
            resumeUrl: about.resumeUrl || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch About:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5 MB.");
      return;
    }

    setImageFile(file);
    setMessage("");
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      setMessage("Please select an image first.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("image", imageFile);

      const response = await api.post("/upload/image", formData);

      console.log("Upload response:", response.data);

      const imageUrl = response.data?.data?.url;

      if (!imageUrl) {
        throw new Error("Image URL was not returned by server.");
      }

      setForm((previous) => ({
        ...previous,
        profileImage: imageUrl,
      }));

      setImageFile(null);

      setMessage("Profile image uploaded successfully.");
    } catch (error: any) {
      console.error("Image upload error:", error);

      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload profile image."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const data = {
        title: form.title,
        description: form.description,
        profileImage: form.profileImage || null,
        resumeUrl: form.resumeUrl || null,
      };

      if (form.id) {
        await api.put("/about", data);
      } else {
        const response = await api.post("/about", data);

        if (response.data?.data) {
          setForm((previous) => ({
            ...previous,
            id: response.data.data.id,
          }));
        }
      }

      setMessage("About information saved successfully.");
    } catch (error: any) {
      console.error("Save About error:", error);

      setMessage(
        error?.response?.data?.message ||
          "Failed to save About information."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading About...</p>;
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          About
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your portfolio profile, introduction, image and resume.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-6 rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Title
          </label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Full Stack Web Developer"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Write your About description..."
            rows={6}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
          />
        </div>

        {/* Profile Image */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Profile Image
          </label>

          <div className="rounded-xl border border-dashed border-gray-300 p-5">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600"
            />

            {imageFile && (
              <p className="mt-3 text-sm text-gray-600">
                Selected: {imageFile.name}
              </p>
            )}

            <button
              type="button"
              onClick={handleImageUpload}
              disabled={!imageFile || uploading}
              className="mt-4 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Profile Image"}
            </button>
          </div>

          {/* Current Image Preview */}
          {form.profileImage && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Current Profile Image
              </p>

              <img
                src={form.profileImage}
                alt="Profile"
                className="h-40 w-40 rounded-2xl border border-gray-200 object-cover shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Resume */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Resume URL
          </label>

          <input
            type="url"
            name="resumeUrl"
            value={form.resumeUrl}
            onChange={handleChange}
            placeholder="https://your-resume-link.com/resume.pdf"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
          />

          <p className="mt-2 text-xs text-gray-500">
            Add your real resume PDF link here.
          </p>
        </div>

        {/* Save */}
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save About"}
        </button>
      </form>
    </div>
  );
};

export default About;