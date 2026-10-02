import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import api from "../services/api";

interface Skill {
  id: string;
  name: string;
  category: string;
  level?: number | null;
  icon?: string | null;
}

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    level: "",
    icon: "",
  });

  const fetchSkills = async () => {
    try {
      const response = await api.get("/skills");
      setSkills(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      level: "",
      icon: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    const data = {
      name: form.name,
      category: form.category,
      level: form.level ? Number(form.level) : null,
      icon: form.icon || null,
    };

    try {
      if (editingId) {
        await api.put(`/skills/${editingId}`, data);
      } else {
        await api.post("/skills", data);
      }

      await fetchSkills();
      resetForm();
    } catch (error: any) {
      console.error("Save skill error:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to save skill."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setForm({
      name: skill.name,
      category: skill.category,
      level: skill.level?.toString() || "",
      icon: skill.icon || "",
    });

    setEditingId(skill.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/skills/${id}`);
      await fetchSkills();
    } catch (error) {
      console.error("Delete skill error:", error);
      alert("Failed to delete skill.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Skills
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your technical skills.
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
          Add Skill
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? "Edit Skill" : "Add Skill"}
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
                Skill Name
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="JavaScript"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>

              <input
                type="text"
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
                placeholder="Frontend"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Level
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={form.level}
                onChange={(e) =>
                  setForm({
                    ...form,
                    level: e.target.value,
                  })
                }
                placeholder="80"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Icon
              </label>

              <input
                type="text"
                value={form.icon}
                onChange={(e) =>
                  setForm({
                    ...form,
                    icon: e.target.value,
                  })
                }
                placeholder="Code2"
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
                  ? "Update Skill"
                  : "Create Skill"}
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

      {/* Skills List */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-gray-600">
            Loading skills...
          </div>
        ) : skills.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No skills found. Click "Add Skill" to create one.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-5"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {skill.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {skill.category}
                    {skill.level !== null &&
                    skill.level !== undefined
                      ? ` • ${skill.level}%`
                      : ""}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(skill.id)}
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

export default Skills;