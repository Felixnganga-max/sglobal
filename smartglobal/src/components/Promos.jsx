import React, { useState, useEffect, useRef, useCallback } from "react";

const API = "https://sglobal-plf6.vercel.app/smartglobal/promos";

const fmt = (bytes) => {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const fmtDuration = (s) => {
  if (!s) return "—";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold shadow-lg border ${
            t.type === "error"
              ? "bg-white border-red-200 text-red-600"
              : "bg-white border-green-200 text-green-700"
          }`}
          style={{ fontFamily: "var(--font-body)", minWidth: 240 }}
        >
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              t.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          />
          <span className="flex-1">{t.msg}</span>
          <button
            onClick={() => remove(t.id)}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none ml-1"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ background: "rgba(26,26,26,0.45)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{
          border: "1px solid var(--color-border)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <span
            className="font-heading font-bold uppercase tracking-wide"
            style={{ fontSize: "0.9rem", color: "var(--color-text)" }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-xl leading-none transition-colors"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Video Player Modal ───────────────────────────────────────────────────────
function VideoPlayerModal({ video, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current?.play();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Player header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ background: "#111" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-base">🎬</span>
            <div className="min-w-0">
              <div
                className="font-bold uppercase truncate"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.78rem",
                  letterSpacing: "0.06em",
                  color: "#fff",
                }}
              >
                {video.title}
              </div>
              {video.description && (
                <div
                  className="truncate"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.65rem",
                    color: "rgba(255,255,255,0.45)",
                    marginTop: 2,
                  }}
                >
                  {video.description}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white text-xl leading-none flex-shrink-0 ml-3 transition-colors"
            style={{ background: "rgba(255,255,255,0.1)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
          >
            ×
          </button>
        </div>

        {/* Video */}
        <div className="bg-black" style={{ aspectRatio: "16/9" }}>
          <video
            ref={videoRef}
            src={video.videoUrl}
            controls
            autoPlay
            className="w-full h-full"
            style={{ display: "block", maxHeight: "70vh" }}
            onEnded={onClose}
          />
        </div>

        {/* Footer meta */}
        <div
          className="flex items-center gap-4 px-4 py-3 flex-wrap"
          style={{ background: "#111" }}
        >
          {video.duration && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              ⏱ {fmtDuration(video.duration)}
            </span>
          )}
          {video.format && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              🎞 {video.format.toUpperCase()}
            </span>
          )}
          {video.size && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              💾 {fmt(video.size)}
            </span>
          )}
          {video.tags?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap ml-auto">
              {video.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full px-2 py-0.5"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.62rem",
                    fontWeight: 600,
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Upload / Edit Form ───────────────────────────────────────────────────────
function VideoForm({ initial, onSave, onCancel, loading }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [tags, setTags] = useState(initial?.tags?.join(", ") || "");
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured || false);
  const [displayOrder, setDisplayOrder] = useState(initial?.displayOrder ?? 0);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();
  const isEdit = !!initial;

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("tags", tags);
    fd.append("isFeatured", isFeatured);
    fd.append("displayOrder", displayOrder);
    if (file) fd.append("video", file);
    onSave(fd);
  };

  const inputCls =
    "w-full mt-1.5 px-3 py-2.5 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div>
        <label className="text-label" style={{ color: "var(--color-muted)" }}>
          Title <span style={{ color: "var(--color-red)" }}>*</span>
        </label>
        <input
          className={inputCls}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Campaign title"
          required
          style={{ fontFamily: "var(--font-body)" }}
        />
      </div>

      <div>
        <label className="text-label" style={{ color: "var(--color-muted)" }}>
          Description
        </label>
        <textarea
          className={inputCls}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description…"
          rows={3}
          style={{ fontFamily: "var(--font-body)", resize: "vertical" }}
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-label" style={{ color: "var(--color-muted)" }}>
            Tags{" "}
            <span
              style={{
                textTransform: "none",
                letterSpacing: 0,
                fontWeight: 400,
              }}
            >
              (comma-separated)
            </span>
          </label>
          <input
            className={inputCls}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="launch, promo, Q4"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>
        <div style={{ width: 110 }}>
          <label className="text-label" style={{ color: "var(--color-muted)" }}>
            Order
          </label>
          <input
            className={inputCls}
            type="number"
            min={0}
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>
      </div>

      {/* Featured toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div
          role="checkbox"
          aria-checked={isFeatured}
          onClick={() => setIsFeatured(!isFeatured)}
          className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer flex-shrink-0 ${
            isFeatured ? "bg-orange-400" : "bg-gray-200"
          }`}
        >
          <div
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              isFeatured ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </div>
        <span
          className="text-sm font-medium"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-muted)",
          }}
        >
          Mark as Featured
        </span>
      </label>

      {/* Drop zone */}
      <div>
        <label className="text-label" style={{ color: "var(--color-muted)" }}>
          {isEdit ? (
            "Replace Video (optional)"
          ) : (
            <>
              Video File <span style={{ color: "var(--color-red)" }}>*</span>
            </>
          )}
        </label>
        <div
          className={`mt-1.5 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            dragging
              ? "border-blue-400 bg-blue-50"
              : "border-gray-200 hover:border-gray-300 bg-gray-50"
          }`}
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            setFile(e.dataTransfer.files[0]);
          }}
        >
          {file ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">🎬</span>
              <span
                className="text-sm font-semibold truncate max-w-xs"
                style={{
                  color: "var(--color-blue)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {file.name}
              </span>
              <span className="text-xs text-gray-400">({fmt(file.size)})</span>
            </div>
          ) : (
            <>
              <div className="text-2xl mb-1.5">⬆</div>
              <div
                className="text-sm font-medium text-gray-500"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Drag & drop or click to select
              </div>
              <div className="text-xs text-gray-400 mt-1">
                MP4, MOV, AVI · max 200 MB
              </div>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          className="hidden"
          required={!isEdit}
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <button
          type="button"
          className="btn-outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Uploading…" : isEdit ? "Save Changes" : "Upload Video"}
        </button>
      </div>
    </form>
  );
}

// ─── Video Card ───────────────────────────────────────────────────────────────
function VideoCard({ video, onEdit, onDelete, onToggle, onPlay }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      className="flex items-center gap-4 bg-white rounded-2xl p-3 transition-shadow hover:shadow-md"
      style={{
        border: "1px solid var(--color-border)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Thumbnail */}
      <div
        className="relative flex-shrink-0 cursor-pointer group"
        onClick={() => onPlay(video)}
      >
        {!imgErr ? (
          <div
            className="img-card"
            style={{
              width: 112,
              height: 64,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
              onError={() => setImgErr(true)}
            />
          </div>
        ) : (
          <div
            className="flex items-center justify-center text-2xl bg-gray-100 rounded-xl"
            style={{ width: 112, height: 64 }}
          >
            🎬
          </div>
        )}

        {/* Play overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(0,0,0,0.45)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.92)" }}
          >
            <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
              <path d="M1 1l9 5.5-9 5.5V1z" fill="#1a1a1a" />
            </svg>
          </div>
        </div>

        {/* Status badge */}
        <span
          className="absolute bottom-1 left-1 rounded-full px-2 py-0.5"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.55rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            background: video.isActive ? "#dcfce7" : "#fee2e2",
            color: video.isActive ? "#15803d" : "#dc2626",
          }}
        >
          {video.isActive ? "Active" : "Inactive"}
        </span>

        {video.isFeatured && (
          <span
            className="absolute top-1 right-1 rounded-full px-2 py-0.5"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.5rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "#fff7ed",
              color: "var(--color-orange)",
              border: "1px solid #fed7aa",
            }}
          >
            ★ Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div
          className="font-body font-bold uppercase truncate"
          style={{
            fontSize: "0.82rem",
            letterSpacing: "0.06em",
            color: "var(--color-text)",
          }}
        >
          {video.title}
        </div>
        {video.description && (
          <div className="text-xs text-gray-400 truncate mt-0.5">
            {video.description}
          </div>
        )}
        <div className="flex gap-3 mt-1.5 flex-wrap">
          {video.duration && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.62rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
              }}
            >
              ⏱ {fmtDuration(video.duration)}
            </span>
          )}
          {video.format && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.62rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
              }}
            >
              🎞 {video.format.toUpperCase()}
            </span>
          )}
          {video.size && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.62rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
              }}
            >
              💾 {fmt(video.size)}
            </span>
          )}
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
            }}
          >
            #{video.displayOrder}
          </span>
        </div>
        {video.tags?.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-1.5">
            {video.tags.map((t) => (
              <span
                key={t}
                className="rounded-full px-2 py-0.5"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  background: "#eff6ff",
                  color: "var(--color-blue)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 flex-shrink-0">
        <button
          onClick={() => onPlay(video)}
          title="Play"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors bg-gray-100 hover:bg-blue-100"
        >
          ▶
        </button>
        <button
          onClick={() => onEdit(video)}
          title="Edit"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors bg-gray-100 hover:bg-blue-100"
        >
          ✏️
        </button>
        <button
          onClick={() => onToggle(video)}
          title={video.isActive ? "Deactivate" : "Activate"}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors ${
            video.isActive
              ? "bg-orange-50 hover:bg-orange-100"
              : "bg-green-50 hover:bg-green-100"
          }`}
        >
          {video.isActive ? "⏸" : "▶"}
        </button>
        <button
          onClick={() => onDelete(video)}
          title="Delete"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors bg-gray-100 hover:bg-red-100"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Promo() {
  const [videos, setVideos] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showUpload, setShowUpload] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [hardDelete, setHardDelete] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null); // ← new

  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  const toast = useCallback((msg, type = "success") => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const removeToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const fetchVideos = useCallback(
    async (p = 1) => {
      setFetching(true);
      try {
        const res = await fetch(`${API}/admin/all?page=${p}&limit=20`);
        const data = await res.json();
        if (data.success) {
          setVideos(data.data);
          setTotal(data.total);
          setPage(data.page);
          setPages(data.pages);
        } else {
          toast(data.message || "Failed to load videos.", "error");
        }
      } catch {
        toast("Network error. Is the server running?", "error");
      } finally {
        setFetching(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    fetchVideos(1);
  }, [fetchVideos]);

  const handleCreate = async (fd) => {
    setSaving(true);
    try {
      const res = await fetch(API, { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        toast("Video uploaded successfully!");
        setShowUpload(false);
        fetchVideos(1);
      } else {
        toast(data.message || "Upload failed.", "error");
      }
    } catch {
      toast("Network error.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (fd) => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/${editing._id}`, {
        method: "PATCH",
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        toast("Video updated.");
        setEditing(null);
        fetchVideos(page);
      } else {
        toast(data.message || "Update failed.", "error");
      }
    } catch {
      toast("Network error.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (video) => {
    try {
      const res = await fetch(`${API}/${video._id}/toggle-active`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        toast(data.message);
        setVideos((vs) =>
          vs.map((v) =>
            v._id === video._id ? { ...v, isActive: data.data.isActive } : v,
          ),
        );
      } else {
        toast(data.message || "Toggle failed.", "error");
      }
    } catch {
      toast("Network error.", "error");
    }
  };

  const handleDelete = async () => {
    const video = confirmDelete;
    setConfirmDelete(null);
    try {
      const res = await fetch(`${API}/${video._id}?hard=${hardDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast(data.message);
        fetchVideos(page);
      } else {
        toast(data.message || "Delete failed.", "error");
      }
    } catch {
      toast("Network error.", "error");
    }
    setHardDelete(false);
  };

  const activeCount = videos.filter((v) => v.isActive).length;
  const featuredCount = videos.filter((v) => v.isFeatured).length;
  const inactiveCount = videos.filter((v) => !v.isActive).length;

  return (
    <div
      className="min-h-screen bg-soft page-x section-y"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <Toast toasts={toasts} remove={removeToast} />

      {/* Page header */}
      <div className="flex items-end justify-between mb-7">
        <div>
          <p className="text-eyebrow">Content Management</p>
          <h1
            className="text-section-title mt-1"
            style={{ color: "var(--color-text)" }}
          >
            Promo Videos
          </h1>
          <div className="section-rule" />
          <p
            className="mt-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.78rem",
              color: "var(--color-muted)",
            }}
          >
            {total} video{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowUpload(true)}>
          + Upload Video
        </button>
      </div>

      {/* Stats bar */}
      {videos.length > 0 && (
        <div
          className="flex gap-6 mb-5 px-5 py-4 bg-white rounded-2xl"
          style={{ border: "1px solid var(--color-border)" }}
        >
          {[
            { label: "Total", value: total, color: "var(--color-blue)" },
            { label: "Active", value: activeCount, color: "#15803d" },
            {
              label: "Featured",
              value: featuredCount,
              color: "var(--color-orange)",
            },
            {
              label: "Inactive",
              value: inactiveCount,
              color: "var(--color-red)",
            },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span
                className="font-heading font-bold"
                style={{ fontSize: "1.4rem", color: s.color, lineHeight: 1 }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Video list */}
      <div className="flex flex-col gap-2.5">
        {fetching ? (
          <div
            className="text-center py-16 text-gray-400 text-sm"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Loading videos…
          </div>
        ) : videos.length === 0 ? (
          <div
            className="text-center py-16 bg-white rounded-2xl"
            style={{ border: "1px solid var(--color-border)" }}
          >
            <div className="text-4xl mb-3">🎬</div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
              }}
            >
              No videos yet
            </div>
            <button
              className="btn-primary mt-4"
              onClick={() => setShowUpload(true)}
            >
              Upload First Video
            </button>
          </div>
        ) : (
          videos.map((v) => (
            <VideoCard
              key={v._id}
              video={v}
              onEdit={setEditing}
              onDelete={setConfirmDelete}
              onToggle={handleToggle}
              onPlay={setPlayingVideo}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex gap-2 mt-6 justify-center">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchVideos(p)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                fontWeight: 600,
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: p === page ? "none" : "1px solid var(--color-border)",
                background: p === page ? "var(--color-blue)" : "#fff",
                color: p === page ? "#fff" : "var(--color-muted)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Video player modal */}
      {playingVideo && (
        <VideoPlayerModal
          video={playingVideo}
          onClose={() => setPlayingVideo(null)}
        />
      )}

      {/* Upload modal */}
      {showUpload && (
        <Modal title="Upload Promo Video" onClose={() => setShowUpload(false)}>
          <VideoForm
            onSave={handleCreate}
            onCancel={() => setShowUpload(false)}
            loading={saving}
          />
        </Modal>
      )}

      {/* Edit modal */}
      {editing && (
        <Modal title="Edit Promo Video" onClose={() => setEditing(null)}>
          <VideoForm
            initial={editing}
            onSave={handleUpdate}
            onCancel={() => setEditing(null)}
            loading={saving}
          />
        </Modal>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <Modal title="Delete Video" onClose={() => setConfirmDelete(null)}>
          <div style={{ fontFamily: "var(--font-body)" }}>
            <p
              className="text-sm text-gray-600 mb-4"
              style={{ lineHeight: 1.7 }}
            >
              Are you sure you want to delete{" "}
              <strong style={{ color: "var(--color-text)" }}>
                "{confirmDelete.title}"
              </strong>
              ?
            </p>
            <label
              className="flex items-start gap-3 cursor-pointer p-3 rounded-xl"
              style={{ background: "#fff5f5", border: "1px solid #fed7d7" }}
            >
              <input
                type="checkbox"
                checked={hardDelete}
                onChange={(e) => setHardDelete(e.target.checked)}
                className="mt-0.5"
              />
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-red)",
                  }}
                >
                  Permanently delete from Cloudinary
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#e57373" }}>
                  This cannot be undone. The file will be removed from storage.
                </div>
              </div>
            </label>
            <div className="flex justify-end gap-3 mt-5">
              <button
                className="btn-outline"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                style={
                  !hardDelete
                    ? { background: "#374151", boxShadow: "none" }
                    : undefined
                }
                onClick={handleDelete}
              >
                {hardDelete ? "Permanently Delete" : "Soft Delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
