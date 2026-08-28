export function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

// Blog posts store `content` as rich HTML straight from the dashboard editor.
export function contentToHtml(content) {
  return typeof content === "string" ? content : "";
}
