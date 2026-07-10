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

// Live posts store `content` as rich HTML straight from the dashboard
// editor; the curated posts in lib/data.js still use the older typed-block
// shape. Normalize either into HTML so both render the same way.
export function contentToHtml(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((block) => {
      if (block.type === "heading") return `<h2>${block.text}</h2>`;
      if (block.type === "subheading") return `<h3>${block.text}</h3>`;
      if (block.type === "paragraph") return `<p>${block.text}</p>`;
      if (block.type === "image")
        return `<img src="${block.src}" alt="${block.alt || ""}" />`;
      return "";
    })
    .join("");
}
