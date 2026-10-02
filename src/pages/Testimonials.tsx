import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import api from "../services/api";

interface Testimonial {
  id: string;
  name: string;
  role?: string | null;
  company?: string | null;
  message: string;
  image?: string | null;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    role: "",
    company: "",
    message: "",
    image: "",
  });

  const fetchTestimonials = async () => {
    try {
      const response = await api.get("/testimonials");
      setTestimonials(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      role: "",
      company: "",
      message: "",
      image: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      name: form.name,
      message: form.message,
      ...(form.role.trim() && {
        role: form.role.trim(),
      }),
      ...(form.company.trim() && {
        company: form.company.trim(),
      }),
      ...(form.image.trim() && {
        image: form.image.trim(),
      }),
    };

    try {
      if (editingId) {
        await api.put(`/testimonials/${editingId}`, data);
      } else {
        await api.post("/testimonials", data);
      }

      await fetchTestimonials();
      resetForm();
    } catch (error: any) {
      console.error("Save testimonial error:", error);

      alert(
        JSON.stringify(
          error?.response?.data || {
            message:
              error?.message || "Failed to save testimonial.",
          },
          null,
          2
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setForm({
      name: testimonial.name,
      role: testimonial.role || "",
      company: testimonial.company || "",
      message: testimonial.message,
      image: testimonial.image || "",
    });

    setEditingId(testimonial.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this testimonial?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/testimonials/${id}`);
      await fetchTestimonials();
    } catch (error) {
      console.error("Delete testimonial error:", error);
      alert("Failed to delete testimonial.");
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Testimonials
          </h1>

          <p className="mt-2 text-gray-600">
            Manage testimonials from clients and colleagues.
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
          Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId
                ? "Edit Testimonial"
                : "Add Testimonial"}
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
                Name
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
                placeholder="Client Name"
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
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value,
                  })
                }
                placeholder="Founder / CEO"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>

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
                placeholder="Company Name"
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

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Message
              </label>

              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message: e.target.value,
                  })
                }
                placeholder="Write the testimonial..."
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
                  ? "Update Testimonial"
                  : "Create Testimonial"}
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
            Loading testimonials...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No testimonials found. Click "Add Testimonial" to
            create one.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex items-start justify-between gap-5 p-5"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h3>

                  {(testimonial.role ||
                    testimonial.company) && (
                    <p className="mt-1 text-sm text-gray-500">
                      {testimonial.role}
                      {testimonial.role &&
                        testimonial.company &&
                        " • "}
                      {testimonial.company}
                    </p>
                  )}

                  <p className="mt-3 text-sm text-gray-600">
                    "{testimonial.message}"
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() =>
                      handleEdit(testimonial)
                    }
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(testimonial.id)
                    }
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

export default Testimonials;