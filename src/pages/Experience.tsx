import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import api from "../services/api";

interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  description: string;
}

const Experience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const fetchExperiences = async () => {
    try {
      const response = await api.get("/experience");
      setExperiences(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const resetForm = () => {
    setForm({
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      company: form.company,
     position: form.position,
      startDate: form.startDate,
      description: form.description,
      ...(form.location.trim() && {
        location: form.location.trim(),
      }),
      ...(form.endDate.trim() && {
        endDate: form.endDate.trim(),
      }),
    };

    try {
      if (editingId) {
        await api.put(`/experience/${editingId}`, data);
      } else {
        await api.post("/experience", data);
      }

      await fetchExperiences();
      resetForm();
    } catch (error: any) {
      console.error("Save experience error:", error);

      alert(
        JSON.stringify(
          error?.response?.data || {
            message:
              error?.message || "Failed to save experience.",
          },
          null,
          2
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (experience: Experience) => {
    setForm({
      company: experience.company,
     position: experience.position,
      location: experience.location || "",
      startDate: experience.startDate
        ? experience.startDate.slice(0, 10)
        : "",
      endDate: experience.endDate
        ? experience.endDate.slice(0, 10)
        : "",
      description: experience.description,
    });

    setEditingId(experience.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/experience/${id}`);
      await fetchExperiences();
    } catch (error) {
      console.error("Delete experience error:", error);
      alert("Failed to delete experience.");
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Experience
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your professional experience.
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
          Add Experience
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? "Edit Experience" : "Add Experience"}
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
                Company
              </label>

              <input
                type="text"
                value={form.company}
                onChange={(e) =>
                  setForm({
                    ...form,
                    company: e.target.value,
                  })
                }
                placeholder="LabMentix"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Role
              </label>

              <input
                type="text"
                value={form.position}
                onChange={(e) =>
                  setForm({
                    ...form,
                    position: e.target.value,
                  })
                }
                placeholder="Web Development Intern"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>

              <input
                type="text"
                value={form.location}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: e.target.value,
                  })
                }
                placeholder="Remote"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start Date
              </label>

              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startDate: e.target.value,
                  })
                }
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                End Date
              </label>

              <input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endDate: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />

              <p className="mt-1 text-xs text-gray-500">
                Leave blank if this experience is ongoing.
              </p>
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
                placeholder="Describe your responsibilities and achievements..."
                rows={6}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
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
                  ? "Update Experience"
                  : "Create Experience"}
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
            Loading experiences...
          </div>
        ) : experiences.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No experience found. Click "Add Experience" to create one.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {experiences.map((experience) => (
              <div
                key={experience.id}
                className="flex items-start justify-between gap-5 p-5"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">
                   {experience.position}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {experience.company}
                  </p>

                  {experience.location && (
                    <p className="mt-1 text-sm text-gray-500">
                      {experience.location}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-gray-400">
                    {experience.startDate?.slice(0, 10)}
                    {" → "}
                    {experience.endDate
                      ? experience.endDate.slice(0, 10)
                      : "Present"}
                  </p>

                  <p className="mt-3 text-sm text-gray-500">
                    {experience.description}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleEdit(experience)}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(experience.id)}
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

export default Experience;