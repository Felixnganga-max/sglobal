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

const API_BASE = "https://sglobal-plf6.vercel.app/smartglobal/zones";

function getToken() {
  return localStorage.getItem("token") || "";
}

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

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

  return (
    <div className="bg-soft" style={{ minHeight: "100vh", padding: "2rem 0" }}>
      <div className="page-x" style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "1.75rem",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div
              className="bg-red"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <MapPin size={18} color="#fff" />
            </div>
            <div>
              <div
                className="text-section-title"
                style={{ fontSize: "1.1rem" }}
              >
                Delivery Zones
              </div>
              <div
                className="text-body text-muted"
                style={{ fontSize: "0.75rem", marginTop: 2 }}
              >
                {zones.length} zone{zones.length !== 1 ? "s" : ""} configured
              </div>
            </div>
          </div>
          <button
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <Plus size={14} /> Add Zone
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#ef4444",
              borderRadius: 10,
              padding: "0.75rem 1rem",
              marginBottom: "1rem",
            }}
          >
            <AlertCircle size={14} />
            <span
              className="text-label"
              style={{
                textTransform: "none",
                letterSpacing: 0,
                fontWeight: 400,
              }}
            >
              {error}
            </span>
          </div>
        )}

        {/* Add / Edit Form */}
        {showForm && (
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--color-border)",
              borderRadius: 16,
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <div className="text-card-title" style={{ marginBottom: "1.1rem" }}>
              {editingId ? "Edit Zone" : "Add New Zone"}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 160px",
                gap: "0.75rem",
                marginBottom: "0.75rem",
              }}
            >
              <div>
                <label
                  className="text-eyebrow"
                  style={{ display: "block", marginBottom: 6 }}
                >
                  Zone Name *
                </label>
                <input
                  style={{
                    width: "100%",
                    background: "var(--color-bg-soft)",
                    border: "1.5px solid var(--color-border)",
                    borderRadius: 10,
                    padding: "0.6rem 0.875rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    color: "var(--color-text)",
                    outline: "none",
                  }}
                  placeholder="e.g. Westlands & Northern Suburbs"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-red)";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-border)";
                    e.target.style.background = "var(--color-bg-soft)";
                  }}
                />
              </div>
              <div>
                <label
                  className="text-eyebrow"
                  style={{ display: "block", marginBottom: 6 }}
                >
                  Delivery Fee (KSh) *
                </label>
                <input
                  type="number"
                  min="0"
                  style={{
                    width: "100%",
                    background: "var(--color-bg-soft)",
                    border: "1.5px solid var(--color-border)",
                    borderRadius: 10,
                    padding: "0.6rem 0.875rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    color: "var(--color-text)",
                    outline: "none",
                  }}
                  placeholder="e.g. 300"
                  value={form.deliveryFee}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, deliveryFee: e.target.value }))
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-red)";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-border)";
                    e.target.style.background = "var(--color-bg-soft)";
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                className="text-eyebrow"
                style={{ display: "block", marginBottom: 6 }}
              >
                Description{" "}
                <span
                  style={{
                    color: "var(--color-muted)",
                    fontWeight: 400,
                    textTransform: "none",
                    letterSpacing: 0,
                    fontSize: "0.7rem",
                  }}
                >
                  — optional
                </span>
              </label>
              <input
                style={{
                  width: "100%",
                  background: "var(--color-bg-soft)",
                  border: "1.5px solid var(--color-border)",
                  borderRadius: 10,
                  padding: "0.6rem 0.875rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "var(--color-text)",
                  outline: "none",
                }}
                placeholder="e.g. Gigiri, Runda, Muthaiga, Kitisuru..."
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-red)";
                  e.target.style.background = "#fff";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--color-border)";
                  e.target.style.background = "var(--color-bg-soft)";
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.625rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={resetForm}
                style={{
                  padding: "0.6rem 1.1rem",
                  background: "#f0f0f0",
                  color: "#555",
                  border: "none",
                  borderRadius: 10,
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <X size={13} /> Cancel
              </button>
              <button
                className="btn-primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  opacity:
                    saving || !form.name || form.deliveryFee === "" ? 0.5 : 1,
                  cursor:
                    saving || !form.name || form.deliveryFee === ""
                      ? "not-allowed"
                      : "pointer",
                }}
                onClick={handleSave}
                disabled={saving || !form.name || form.deliveryFee === ""}
              >
                {saving ? (
                  <Loader2
                    size={13}
                    style={{ animation: "spin 0.7s linear infinite" }}
                  />
                ) : (
                  <Check size={13} />
                )}
                {saving ? "Saving…" : "Save Zone"}
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--color-border)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {/* Table Head */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 130px 100px 110px",
              padding: "0.75rem 1.25rem",
              background: "var(--color-bg-soft)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            {["Zone", "Delivery Fee", "Status", "Actions"].map((h) => (
              <div
                key={h}
                className="text-eyebrow"
                style={{ color: "var(--color-muted)" }}
              >
                {h}
              </div>
            ))}
          </div>

          {loading ? (
            <div
              style={{
                padding: "3rem",
                textAlign: "center",
                color: "var(--color-muted)",
              }}
            >
              <Loader2
                size={20}
                style={{ animation: "spin 0.7s linear infinite" }}
              />
            </div>
          ) : zones.length === 0 ? (
            <div
              style={{ padding: "3rem 1.25rem", textAlign: "center" }}
              className="text-body text-muted"
            >
              No zones yet — add your first delivery zone above.
            </div>
          ) : (
            zones.map((zone) => (
              <div
                key={zone._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 130px 100px 110px",
                  padding: "0.875rem 1.25rem",
                  borderBottom: "1px solid var(--color-bg-soft)",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--color-bg-soft)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#fff")
                }
              >
                <div>
                  <div
                    className="text-card-title"
                    style={{ textTransform: "none", letterSpacing: 0 }}
                  >
                    {zone.name}
                  </div>
                  {zone.description && (
                    <div
                      className="text-body text-muted"
                      style={{ fontSize: "0.72rem", marginTop: 2 }}
                    >
                      {zone.description}
                    </div>
                  )}
                </div>

                <div className="text-label text-red">
                  KSh {zone.deliveryFee.toLocaleString()}
                </div>

                <div>
                  <span
                    className="text-label"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: "0.68rem",
                      background: zone.isActive ? "#f0fdf4" : "#f5f5f5",
                      color: zone.isActive ? "#16a34a" : "var(--color-muted)",
                      border: `1px solid ${zone.isActive ? "#bbf7d0" : "var(--color-border)"}`,
                    }}
                  >
                    {zone.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {/* Edit */}
                  <button
                    title="Edit"
                    onClick={() => handleEdit(zone)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1.5px solid var(--color-border)",
                      background: "#fff",
                      color: "var(--color-muted)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-blue)";
                      e.currentTarget.style.color = "var(--color-blue)";
                      e.currentTarget.style.background = "#eff6ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.color = "var(--color-muted)";
                      e.currentTarget.style.background = "#fff";
                    }}
                  >
                    <Pencil size={13} />
                  </button>
                  {/* Toggle */}
                  <button
                    title="Toggle active"
                    onClick={() => handleToggle(zone._id)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1.5px solid var(--color-border)",
                      background: "#fff",
                      color: "var(--color-muted)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#16a34a";
                      e.currentTarget.style.color = "#16a34a";
                      e.currentTarget.style.background = "#f0fdf4";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.color = "var(--color-muted)";
                      e.currentTarget.style.background = "#fff";
                    }}
                  >
                    {zone.isActive ? (
                      <ToggleRight size={13} />
                    ) : (
                      <ToggleLeft size={13} />
                    )}
                  </button>
                  {/* Delete */}
                  <button
                    title="Delete"
                    onClick={() => handleDelete(zone._id)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1.5px solid var(--color-border)",
                      background: "#fff",
                      color: "var(--color-muted)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#ef4444";
                      e.currentTarget.style.color = "#ef4444";
                      e.currentTarget.style.background = "#fef2f2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.color = "var(--color-muted)";
                      e.currentTarget.style.background = "#fff";
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Spin keyframe (minimal, since inline styles handle everything else) */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
