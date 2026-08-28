import React, { useEffect, useState } from "react";
import {
  X,
  Trash2,
  Loader2,
  MessageCircle,
  Heart,
  Reply,
  Send,
} from "lucide-react";
import { blogApi } from "../api/blogApi";
import { formatDate } from "../lib/blogFormat";

export default function BlogCommentsModal({ blog, onClose, onRead }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [savingReply, setSavingReply] = useState(false);
  const [likedIds, setLikedIds] = useState(() => new Set());

  useEffect(() => {
    fetchComments();
    // Let the admin actually see this post's comments before wiping the
    // "new" badge — mark-read fires once the panel is open, not on hover.
    blogApi.markCommentsRead(blog._id).then(() => onRead?.(blog._id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blog._id]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await blogApi.getComments(blog._id);
      setComments(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await blogApi.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.message || "Failed to delete comment");
    }
  };

  const handleLike = async (commentId) => {
    if (likedIds.has(commentId)) return;
    setLikedIds((prev) => new Set(prev).add(commentId));
    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c,
      ),
    );
    try {
      await blogApi.likeComment(commentId);
    } catch {
      // Best-effort — the tap already reflects locally.
    }
  };

  const startReply = (comment) => {
    setReplyingTo(comment._id);
    setReplyText(comment.adminReply?.message || "");
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const handleSendReply = async (commentId) => {
    if (!replyText.trim()) return;
    setSavingReply(true);
    try {
      const res = await blogApi.replyToComment(commentId, replyText.trim());
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? res.data : c)),
      );
      cancelReply();
    } catch (err) {
      alert(err.message || "Failed to post reply");
    } finally {
      setSavingReply(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-none w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h3 className="font-black text-gray-900 flex items-center gap-2">
              <MessageCircle size={18} className="text-[#BF1A1A]" />
              Comments &amp; Engagement
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
              {blog.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-none transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-[#BF1A1A]" />
            </div>
          ) : error ? (
            <p className="text-sm text-red-600 text-center py-6">{error}</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">
              No comments on this post yet.
            </p>
          ) : (
            <div className="space-y-5">
              {comments.map((c) => (
                <div
                  key={c._id}
                  className="pb-5 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">
                          {c.name}
                        </span>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {formatDate(c.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {c.message}
                      </p>

                      {/* Engagement row */}
                      <div className="flex items-center gap-4 mt-2">
                        <button
                          onClick={() => handleLike(c._id)}
                          disabled={likedIds.has(c._id)}
                          className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#BF1A1A] disabled:hover:text-gray-500 transition-colors"
                        >
                          <Heart
                            size={13}
                            className={
                              likedIds.has(c._id)
                                ? "fill-[#BF1A1A] text-[#BF1A1A]"
                                : ""
                            }
                          />
                          {c.likes || 0}
                        </button>
                        <button
                          onClick={() => startReply(c)}
                          className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <Reply size={13} />
                          {c.adminReply?.message ? "Edit reply" : "Reply"}
                        </button>
                      </div>

                      {/* Existing admin reply */}
                      {c.adminReply?.message && replyingTo !== c._id && (
                        <div className="mt-3 ml-4 pl-3 border-l-2 border-[#BF1A1A] bg-gray-50 rounded-none p-3">
                          <p className="text-xs font-bold text-[#BF1A1A] mb-1">
                            Smart Global Team replied
                          </p>
                          <p className="text-sm text-gray-700">
                            {c.adminReply.message}
                          </p>
                        </div>
                      )}

                      {/* Reply composer */}
                      {replyingTo === c._id && (
                        <div className="mt-3 ml-4 flex gap-2">
                          <input
                            autoFocus
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSendReply(c._id);
                              if (e.key === "Escape") cancelReply();
                            }}
                            placeholder="Write a reply as Smart Global Team..."
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-none focus:outline-none focus:border-[#BF1A1A]"
                          />
                          <button
                            onClick={() => handleSendReply(c._id)}
                            disabled={savingReply || !replyText.trim()}
                            className="px-3 bg-[#BF1A1A] text-white rounded-none disabled:opacity-50"
                            title="Send reply"
                          >
                            {savingReply ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Send size={15} />
                            )}
                          </button>
                          <button
                            onClick={cancelReply}
                            className="px-3 border border-gray-300 rounded-none text-gray-500 hover:bg-gray-50"
                            title="Cancel"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-1.5 hover:bg-red-50 rounded-none text-red-500 flex-shrink-0"
                      title="Delete comment"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
