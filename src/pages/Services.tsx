import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import api from "../services/api";

interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "",
  });

  const fetchServices = async () => {
    try {
      const response = await api.get("/services");
      setServices(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      icon: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      ...(form.icon.trim() && {
        icon: form.icon.trim(),
      }),
    };

    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, data);
      } else {
        await api.post("/services", data);
      }

      await fetchServices();
      resetForm();
    } catch (error: any) {
      console.error("Save service error:", error);

      alert(
        JSON.stringify(
          error?.response?.data || {
            message: error?.message || "Failed to save service.",
          },
          null,
          2
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service: Service) => {
    setForm({
      title: service.title,
      description: service.description,
      icon: service.icon || "",
    });

    setEditingId(service.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/services/${id}`);
      await fetchServices();
    } catch (error) {
      console.error("Delete service error:", error);
      alert("Failed to delete service.");
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Services
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your portfolio services.
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
          Add Service
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? "Edit Service" : "Add Service"}
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
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Service Title
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
                placeholder="Web Development"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />
            </div>

            <div>
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
                placeholder="I build modern and responsive web applications..."
                rows={5}
                required
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

              <p className="mt-2 text-xs text-gray-500">
                Optional. Example: Code2, Database, Layout.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Service"
                  : "Create Service"}
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
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No services found. Click "Add Service" to create one.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex items-start justify-between gap-5 p-5"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">
                    {service.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {service.description}
                  </p>

                  {service.icon && (
                    <p className="mt-2 text-xs text-gray-400">
                      Icon: {service.icon}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(service.id)}
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

export default Services;