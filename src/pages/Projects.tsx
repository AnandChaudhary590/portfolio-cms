import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import api from "../services/api";

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  technologies?: string[] | null;
  featured: boolean;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
  title: "",
  description: "",
  image: "",
  liveUrl: "",
  githubUrl: "",
  technologies: "",
  featured: false,
});
  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
  setForm({
    title: "",
    description: "",
    image: "",
    liveUrl: "",
    githubUrl: "",
    technologies: "",
    featured: false,
  });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    const data = {
  title: form.title,
  description: form.description,
  technologies: form.technologies
    ? form.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [],
    featured: form.featured,
  ...(form.image.trim() && {
    image: form.image.trim(),
  }),
  ...(form.liveUrl.trim() && {
    liveUrl: form.liveUrl.trim(),
  }),
  ...(form.githubUrl.trim() && {
    githubUrl: form.githubUrl.trim(),
  }),
};

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, data);
      } else {
        await api.post("/projects", data);
      }

      await fetchProjects();
      resetForm();
    } catch (error: any) {
      console.error("Save project error:", error);

      alert(
  JSON.stringify(
    error?.response?.data || {
      message: error?.message || "Failed to save project.",
    },
    null,
    2
  )
);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
  setForm({
    title: project.title,
    description: project.description,
    image: project.image || "",
    liveUrl: project.liveUrl || "",
    githubUrl: project.githubUrl || "",
    technologies: project.technologies?.join(", ") || "",
    featured: project.featured,
  });

  setEditingId(project.id);
  setShowForm(true);
};

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) rtechnologies: peturn;

    try {
      await api.delete(`/projects/${id}`);
      await fetchProjects();
    } catch (error) {
      console.error("Delete project error:", error);
      alert("Failed to delete project.");
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Projects
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your portfolio projects.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 font-medium text-white hover:bg-gray-800"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? "Edit Project" : "Add Project"}
            </h2>

            <button
              onClick={resetForm}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Project Title
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Portfolio CMS"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Technologies
              </label>

              <input
                type="text"
                value={form.technologies}
                onChange={(e) =>
                  setForm({
                    ...form,
                    technologies: e.target.value,
                  })
                }
                placeholder="React, Node.js, PostgreSQL"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Describe your project..."
                rows={5}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Image URL
              </label>

              <input
                type="url"
                value={form.image}
                onChange={(e) =>
                  setForm({
                    ...form,
                    image: e.target.value,
                  })
                }
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Live URL
              </label>

              <input
                type="url"
                value={form.liveUrl}
                onChange={(e) =>
                  setForm({
                    ...form,
                    liveUrl: e.target.value,
                  })
                }
                placeholder="https://your-project.vercel.app"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                GitHub URL
              </label>

              <input
                type="url"
                value={form.githubUrl}
                onChange={(e) =>
                  setForm({
                    ...form,
                    githubUrl: e.target.value,
                  })
                }
                placeholder="https://github.com/..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>

            {/* Featured Project Checkbox */}
<div className="md:col-span-2">
  <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
    <input
      type="checkbox"
      checked={form.featured}
      onChange={(e) =>
        setForm({
          ...form,
          featured: e.target.checked,
        })
      }
      className="h-4 w-4 rounded border-gray-300"
    />

    Featured Project
  </label>
</div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Project"
                  : "Create Project"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-gray-600">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No projects found. Click "Add Project" to create one.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between gap-5 p-5"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">
                    {project.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {project.description}
                  </p>

                  {project.technologies && project.technologies.length > 0 && (
  <p className="mt-2 text-xs text-gray-400">
    {project.technologies.join(", ")}
  </p>
)}
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(project.id)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;