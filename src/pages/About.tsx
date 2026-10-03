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

  const [loading, setLoading] = useState(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      if (form.id) {
  await api.put("/about", {
          title: form.title,
          description: form.description,
          profileImage: form.profileImage || null,
          resumeUrl: form.resumeUrl || null,
        });
      } else {
        const response = await api.post("/about", {
          title: form.title,
          description: form.description,
          profileImage: form.profileImage || null,
          resumeUrl: form.resumeUrl || null,
        });

        if (response.data?.data) {
          setForm({
            ...form,
            id: response.data.data.id,
          });
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          About
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your portfolio About section.
        </p>
      </div>

      {message && (
        <div className="mb-6 rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
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

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Profile Image URL
          </label>

          <input
            type="url"
            name="profileImage"
            value={form.profileImage}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Resume URL
          </label>

          <input
            type="url"
            name="resumeUrl"
            value={form.resumeUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
          />
        </div>

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