import React, { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { API_BASE_URL } from "../api/config";

const API_BASE = `${API_BASE_URL}/zones`;

function getToken() {
  return localStorage.getItem("token") || "";
}

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

function IconButton({ title, onClick, hoverClass, children }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-400 bg-white transition-colors ${hoverClass}`}
    >
      {children}
    </button>
  );
}

export default function ZoneManager() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    deliveryFee: "",
    description: "",
  });

  const fetchZones = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/all`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setZones(data.data);
    } catch (err) {
      setError(err.message || "Failed to load zones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const resetForm = () => {
    setForm({ name: "", deliveryFee: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (zone) => {
    setForm({
      name: zone.name,
      deliveryFee: zone.deliveryFee,
      description: zone.description || "",
    });
    setEditingId(zone._id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || form.deliveryFee === "") return;
    setSaving(true);
    setError(null);
    try {
      const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify({
          ...form,
          deliveryFee: Number(form.deliveryFee),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      await fetchZones();
      resetForm();
    } catch (err) {
      setError(err.message || "Failed to save zone");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}/toggle`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setZones((prev) => prev.map((z) => (z._id === id ? data.data : z)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this zone?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setZones((prev) => prev.filter((z) => z._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const activeCount = zones.filter((z) => z.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-[#BF1A1A]/10 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-[#BF1A1A]" />
            </div>
            <h1
              className="text-3xl font-black text-gray-900 tracking-tight"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: "0.02em",
              }}
            >
              Delivery Zones
            </h1>
          </div>
          <p className="text-sm text-gray-400 font-medium">
            {loading
              ? "Loading zones..."
              : `${zones.length} zone${zones.length !== 1 ? "s" : ""} configured · ${activeCount} active`}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#BF1A1A] text-white rounded-none font-bold text-sm hover:bg-[#8B1414] transition-all duration-300 shadow-sm hover:shadow-md flex-shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Zone
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-none p-4 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 flex-1">{error}</p>
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-none border border-gray-100 p-6">
          <h3 className="font-black text-gray-900 mb-4">
            {editingId ? "Edit Zone" : "Add New Zone"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px] gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Zone Name *
              </label>
              <input
                placeholder="e.g. Westlands & Northern Suburbs"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Delivery Fee (KSh) *
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 300"
                value={form.deliveryFee}
                onChange={(e) =>
                  setForm((p) => ({ ...p, deliveryFee: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Description{" "}
              <span className="normal-case font-normal text-gray-400">
                — optional
              </span>
            </label>
            <input
              placeholder="e.g. Gigiri, Runda, Muthaiga, Kitisuru..."
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] focus:bg-white transition-all"
            />
          </div>

          <div className="flex gap-2.5 justify-end">
            <button
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-none font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.name || form.deliveryFee === ""}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#BF1A1A] text-white rounded-none font-bold text-sm hover:bg-[#8B1414] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              {saving ? "Saving…" : "Save Zone"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-none border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Zone", "Delivery Fee", "Status", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest ${
                      i === 3 ? "text-center" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#BF1A1A] mx-auto" />
                  </td>
                </tr>
              ) : zones.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-16 text-center text-sm text-gray-400"
                  >
                    No zones yet — add your first delivery zone above.
                  </td>
                </tr>
              ) : (
                zones.map((zone) => (
                  <tr key={zone._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-gray-900 text-sm">
                        {zone.name}
                      </div>
                      {zone.description && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          {zone.description}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-bold text-[#BF1A1A]">
                      KSh {zone.deliveryFee.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold border ${
                          zone.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-gray-50 text-gray-400 border-gray-100"
                        }`}
                      >
                        {zone.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <IconButton
                          title="Edit"
                          onClick={() => handleEdit(zone)}
                          hoverClass="hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </IconButton>
                        <IconButton
                          title="Toggle active"
                          onClick={() => handleToggle(zone._id)}
                          hoverClass="hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50"
                        >
                          {zone.isActive ? (
                            <ToggleRight className="h-3.5 w-3.5" />
                          ) : (
                            <ToggleLeft className="h-3.5 w-3.5" />
                          )}
                        </IconButton>
                        <IconButton
                          title="Delete"
                          onClick={() => handleDelete(zone._id)}
                          hoverClass="hover:border-red-300 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
