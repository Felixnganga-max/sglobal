import React, { useEffect, useState } from "react";
import { X, Trash2, Loader2, MessageCircle } from "lucide-react";
import { blogApi } from "../api/blogApi";
import { formatDate } from "../lib/blogFormat";

export default function BlogCommentsModal({ blog, onClose }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-none w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h3 className="font-black text-gray-900 flex items-center gap-2">
              <MessageCircle size={18} className="text-[#BF1A1A]" />
              Comments
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
            <div className="space-y-4">
              {comments.map((c) => (
                <div
                  key={c._id}
                  className="pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
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
