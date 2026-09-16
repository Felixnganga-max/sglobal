export function slugify(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Builds a URL-friendly slug like "how-to-make-pilau-64f1a2b3c9d1e2f3a4b5c6d7".
// The title portion is just for readability; the trailing id is what
// actually gets looked up.
export function buildBlogSlug(post) {
  const id = post?._id || post?.id || "";
  const base = slugify(post?.title || "post");
  return id ? `${base}-${id}` : base;
}

// Reverses buildBlogSlug(): pulls the 24-char Mongo ObjectId off the end.
// Falls back to the raw param if nothing id-shaped is found (e.g. someone
// hand-typed a URL), so a bad guess degrades gracefully instead of crashing.
export function extractIdFromBlogSlug(slugParam = "") {
  const match = slugParam.match(/([a-f0-9]{24})$/i);
  return match ? match[1] : slugParam;
}