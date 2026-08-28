import React, { useEffect, useState } from "react";
import { Heart, ThumbsDown, MessageCircle, Loader2 } from "lucide-react";
import { blogApi } from "../api/blogApi";
import { formatDate } from "../lib/blogFormat";

/**
 * Like/dislike + comments for a single blog post.
 */
export default function BlogEngagement({ blog }) {
  const blogId = blog._id;

  const [likes, setLikes] = useState(blog.likes || 0);
  const [dislikes, setDislikes] = useState(blog.dislikes || 0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    setLikes(blog.likes || 0);
    setDislikes(blog.dislikes || 0);
    setLiked(false);
    setDisliked(false);
    setComments([]);

    setLoadingComments(true);
    blogApi
      .getComments(blogId)
      .then((res) => setComments(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingComments(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId]);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setDisliked(false);
    setLikes((n) => n + 1);
    try {
      await blogApi.likeBlog(blogId);
    } catch {
      // Best-effort — the tap already reflects locally.
    }
  };

  const handleDislike = async () => {
    if (disliked) return;
    setDisliked(true);
    setLiked(false);
    setDislikes((n) => n + 1);
    try {
      await blogApi.dislikeBlog(blogId);
    } catch {
      // Best-effort — the tap already reflects locally.
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    setCommentError(null);
    try {
      const res = await blogApi.createComment(blogId, {
        name: name.trim(),
        message: message.trim(),
      });
      setComments((prev) => [res.data, ...prev]);
      setName("");
      setMessage("");
    } catch (err) {
      setCommentError(err.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="mt-10 pt-8 border-t"
      style={{ borderColor: "var(--color-border)" }}
    >
      {/* Like / Dislike */}
      <div className="flex flex-wrap items-center gap-3 mb-10">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 px-4 py-2 rounded-full border font-body text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            borderColor: liked ? "var(--color-red)" : "var(--color-border)",
            color: liked ? "var(--color-red)" : "var(--color-text)",
            backgroundColor: liked ? "rgba(255,0,0,0.06)" : "transparent",
          }}
        >
          <Heart size={14} style={{ fill: liked ? "var(--color-red)" : "none" }} />
          {likes}
        </button>
        <button
          onClick={handleDislike}
          className="flex items-center gap-2 px-4 py-2 rounded-full border font-body text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            borderColor: disliked ? "var(--color-blue)" : "var(--color-border)",
            color: disliked ? "var(--color-blue)" : "var(--color-text)",
            backgroundColor: disliked ? "var(--color-blue-tint)" : "transparent",
          }}
        >
          <ThumbsDown size={14} />
          {dislikes}
        </button>
      </div>

      {/* Comments */}
      <div>
        <p className="text-eyebrow mb-3 flex items-center gap-2">
          <MessageCircle size={13} /> Comments{" "}
          {comments.length > 0 && `(${comments.length})`}
        </p>

        <form onSubmit={handleSubmitComment} className="mb-6 space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
            style={{ border: "1px solid var(--color-border)" }}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            required
            className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none resize-none"
            style={{ border: "1px solid var(--color-border)" }}
          />
          {commentError && (
            <p className="text-xs" style={{ color: "var(--color-red)" }}>
              {commentError}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary text-xs disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>

        {loadingComments ? (
          <div className="flex justify-center py-6">
            <Loader2
              className="animate-spin"
              size={18}
              style={{ color: "var(--color-orange)" }}
            />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            No comments yet — be the first to share your thoughts.
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => (
              <div
                key={c._id}
                className="pb-4 border-b"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex items-center justify-between mb-1 gap-3">
                  <span
                    className="font-body text-sm font-bold"
                    style={{ color: "var(--color-text)" }}
                  >
                    {c.name}
                  </span>
                  <span
                    className="font-body text-xs flex-shrink-0"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {formatDate(c.createdAt)}
                  </span>
                </div>
                <p className="font-body text-sm" style={{ color: "#374151" }}>
                  {c.message}
                </p>
                {c.likes > 0 && (
                  <span
                    className="mt-1.5 inline-flex items-center gap-1 font-body text-xs"
                    style={{ color: "var(--color-muted)" }}
                  >
                    <Heart
                      size={11}
                      style={{
                        fill: "var(--color-red)",
                        color: "var(--color-red)",
                      }}
                    />
                    {c.likes}
                  </span>
                )}
                {c.adminReply?.message && (
                  <div
                    className="mt-3 ml-4 pl-3 py-2 rounded-lg"
                    style={{
                      borderLeft: "2px solid var(--color-blue)",
                      backgroundColor: "var(--color-blue-tint)",
                    }}
                  >
                    <p
                      className="font-body text-xs font-bold mb-1"
                      style={{ color: "var(--color-blue)" }}
                    >
                      Smart Global Team replied
                    </p>
                    <p className="font-body text-sm" style={{ color: "#374151" }}>
                      {c.adminReply.message}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
