/**
 * Requests a resized/auto-format variant of a Cloudinary image URL instead
 * of shipping the full upload (product photos are stored at up to 800x800).
 * Non-Cloudinary URLs are returned untouched.
 */
export function withTransform(url, { w, q = "auto", f = "auto" } = {}) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  const params = [w ? `w_${w}` : null, `q_${q}`, `f_${f}`, "c_limit"]
    .filter(Boolean)
    .join(",");
  return url.replace("/upload/", `/upload/${params}/`);
}
