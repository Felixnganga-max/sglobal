import React, { useMemo, useState } from "react";
import {
  Search,
  Grid as GridIcon,
  List as ListIcon,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  ArrowRight,
  ArrowLeft,
  Tag,
  ChefHat,
  Utensils,
} from "lucide-react";
import blogsData from "../lib/data";

function formatDate(iso) {
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

export default function Blogs() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [currentPost, setCurrentPost] = useState(null);
  const perPage = 6;

  const allTags = useMemo(() => {
    const s = new Set();
    blogsData.blogs.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s);
  }, []);

  const categories = blogsData.categories.map((cat) => cat.name);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let res = blogsData.blogs.slice();
    if (selectedCategory) {
      res = res.filter(
        (p) =>
          p.category === selectedCategory ||
          p.tags.some((t) =>
            t.toLowerCase().includes(selectedCategory.toLowerCase()),
          ),
      );
    }
    if (q) {
      res = res.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return res;
  }, [query, selectedCategory]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  function handleTagClick(tag) {
    setSelectedCategory(tag);
    setPage(1);
  }
  function clearFilters() {
    setQuery("");
    setSelectedCategory(null);
    setPage(1);
  }
  function openPost(post) {
    setCurrentPost(post);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function closePost() {
    setCurrentPost(null);
  }

  // ── Single post view ──────────────────────────────────────────
  if (currentPost) {
    return (
      <div className="min-h-screen bg-white">
        {/* Post hero */}
        <div
          className="w-full h-64 sm:h-80 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--color-orange) 0%, var(--color-orange-dark) 100%)",
          }}
        >
          <img
            src={currentPost.featuredImage}
            alt={currentPost.title}
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 page-x flex flex-col justify-end pb-8">
            <button
              onClick={closePost}
              className="inline-flex items-center gap-2 font-body text-xs font-bold text-white/70 hover:text-white mb-4 transition-colors uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Back to Blog
            </button>
            <span
              className="inline-block px-3 py-1 rounded-full font-body text-[0.6rem] font-bold uppercase tracking-widest text-white mb-3 self-start"
              style={{ backgroundColor: "var(--color-orange)" }}
            >
              {currentPost.category}
            </span>
            <h1
              className="font-heading font-bold text-white max-w-3xl"
              style={{
                fontSize: "clamp(1.2rem, 3vw, 2rem)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                lineHeight: 1.15,
              }}
            >
              {currentPost.title}
            </h1>
          </div>
        </div>

        <article className="page-x py-10 max-w-4xl">
          {/* Meta row */}
          <div
            className="flex flex-wrap items-center justify-between gap-4 py-5 border-b mb-8"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center gap-4">
              <img
                src={currentPost.author.avatar}
                alt={currentPost.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p
                  className="font-body text-sm font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  {currentPost.author.name}
                </p>
                <p
                  className="font-body text-xs"
                  style={{ color: "var(--color-muted)" }}
                >
                  {formatDate(currentPost.publishDate)}
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-4"
              style={{ color: "var(--color-muted)" }}
            >
              <span className="flex items-center gap-1.5 font-body text-xs">
                <Clock size={13} /> {currentPost.readTime}
              </span>
              <span className="flex items-center gap-1.5 font-body text-xs">
                <Eye size={13} /> {currentPost.views} views
              </span>
              <button className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                <Heart size={15} style={{ color: "var(--color-orange)" }} />
              </button>
              <button className="p-2 rounded-lg hover:bg-blue-50 transition-colors">
                <Share2 size={15} style={{ color: "var(--color-blue)" }} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-5">
            {currentPost.content.map((block, idx) => {
              if (block.type === "paragraph")
                return (
                  <p
                    key={idx}
                    className="font-body text-sm leading-relaxed"
                    style={{ color: "#374151" }}
                  >
                    {block.text}
                  </p>
                );
              if (block.type === "heading")
                return (
                  <h2
                    key={idx}
                    className="font-heading font-bold text-base mt-8 mb-2"
                    style={{ color: "var(--color-text)" }}
                  >
                    {block.text}
                  </h2>
                );
              if (block.type === "subheading")
                return (
                  <h3
                    key={idx}
                    className="font-heading font-bold text-sm mt-5 mb-1"
                    style={{ color: "var(--color-orange)" }}
                  >
                    {block.text}
                  </h3>
                );
              return null;
            })}
          </div>

          {/* Tags */}
          <div
            className="mt-10 pt-6 border-t"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p className="text-eyebrow mb-3">Related Topics</p>
            <div className="flex flex-wrap gap-2">
              {currentPost.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    closePost();
                    handleTagClick(tag);
                  }}
                  className="font-body text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors duration-200"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-orange)";
                    e.currentTarget.style.color = "var(--color-orange)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.color = "var(--color-text)";
                  }}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </article>
      </div>
    );
  }

  // ── Blog listing view ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div
        className="w-full py-16 sm:py-20"
        style={{
          background:
            "linear-gradient(135deg, var(--color-orange) 0%, var(--color-orange-dark) 100%)",
        }}
      >
        <div className="page-x">
          <div className="flex items-center gap-2 mb-3">
            <ChefHat size={16} style={{ color: "var(--color-orange)" }} />
            <span
              className="text-eyebrow"
              style={{ color: "var(--color-orange)" }}
            >
              Smart Global Blog
            </span>
          </div>
          <h1
            className="font-heading font-bold text-white mb-3"
            style={{
              fontSize: "clamp(1.4rem, 3.5vw, 2.5rem)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              lineHeight: 1.1,
            }}
          >
            Food, Nutrition &<br />
            <span style={{ color: "var(--color-orange)" }}>Healthy Living</span>
          </h1>
          <p className="font-body text-sm text-white/75 max-w-xl leading-relaxed">
            Expert tips, delicious recipes, and nutrition guides for modern
            families who value quality halal food.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="page-x section-y">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <p
            className="font-body text-sm"
            style={{ color: "var(--color-muted)" }}
          >
            <span
              className="font-bold text-lg"
              style={{ color: "var(--color-orange)" }}
            >
              {filtered.length}
            </span>{" "}
            articles
          </p>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2"
                size={15}
                style={{ color: "var(--color-muted)" }}
              />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search recipes, tips..."
                className="w-full pl-9 pr-4 py-2.5 font-body text-sm rounded-full border focus:outline-none transition-colors"
                style={{ borderColor: "var(--color-border)" }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-orange)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--color-border)";
                }}
              />
            </div>
            {(query || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="font-body text-xs font-bold transition-colors"
                style={{ color: "var(--color-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-red)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-muted)")
                }
              >
                Clear
              </button>
            )}
            <div className="hidden sm:flex gap-1.5">
              {[
                ["grid", GridIcon],
                ["list", ListIcon],
              ].map(([v, Icon]) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="p-2 rounded-lg transition-all"
                  style={{
                    backgroundColor:
                      view === v ? "var(--color-orange)" : "transparent",
                    color: view === v ? "#fff" : "var(--color-muted)",
                    border: `1px solid ${view === v ? "var(--color-orange)" : "var(--color-border)"}`,
                  }}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts */}
          <main className="lg:col-span-2">
            {paginated.length === 0 ? (
              <div className="py-20 text-center">
                <Utensils
                  size={40}
                  className="mx-auto mb-4"
                  style={{ color: "var(--color-muted)" }}
                />
                <p
                  className="font-heading text-lg font-bold mb-1"
                  style={{ color: "var(--color-text)" }}
                >
                  No articles found
                </p>
                <p
                  className="font-body text-sm"
                  style={{ color: "var(--color-muted)" }}
                >
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-5"
                    : "flex flex-col gap-5"
                }
              >
                {paginated.map((post) => (
                  <article
                    key={post.id}
                    onClick={() => openPost(post)}
                    className="bg-white rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-lg"
                    style={{ border: "1px solid var(--color-border)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor =
                        "var(--color-orange)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor =
                        "var(--color-border)")
                    }
                  >
                    {/* Image */}
                    <div
                      className={`overflow-hidden ${view === "list" ? "h-44 sm:h-48" : "aspect-[16/10]"}`}
                    >
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-4 sm:p-5">
                      <span
                        className="inline-block px-2.5 py-1 rounded-full font-body text-[0.58rem] font-bold uppercase tracking-widest text-white mb-3"
                        style={{ backgroundColor: "var(--color-orange)" }}
                      >
                        {post.category}
                      </span>

                      <h3
                        className="font-heading font-bold text-sm leading-snug mb-2 line-clamp-2 transition-colors"
                        style={{ color: "var(--color-text)" }}
                      >
                        {post.title}
                      </h3>

                      <p
                        className="font-body text-xs leading-relaxed mb-3 line-clamp-2"
                        style={{ color: "var(--color-muted)" }}
                      >
                        {post.excerpt}
                      </p>

                      <div
                        className="flex items-center gap-4 mb-4"
                        style={{ color: "var(--color-muted)" }}
                      >
                        <span className="flex items-center gap-1 font-body text-[0.62rem]">
                          <Calendar size={11} /> {formatDate(post.publishDate)}
                        </span>
                        <span className="flex items-center gap-1 font-body text-[0.62rem]">
                          <Clock size={11} /> {post.readTime}
                        </span>
                      </div>

                      <div
                        className="flex items-center justify-between pt-3 border-t"
                        style={{ borderColor: "var(--color-border)" }}
                      >
                        <span
                          className="font-body text-xs font-semibold"
                          style={{ color: "var(--color-text)" }}
                        >
                          {post.author.name}
                        </span>
                        <span
                          className="flex items-center gap-1 font-body text-xs font-bold transition-gap"
                          style={{ color: "var(--color-orange)" }}
                        >
                          Read More <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2.5 rounded-lg border transition-all disabled:opacity-30"
                  style={{ borderColor: "var(--color-border)" }}
                  onMouseEnter={(e) => {
                    if (page !== 1) {
                      e.currentTarget.style.backgroundColor =
                        "var(--color-orange)";
                      e.currentTarget.style.borderColor = "var(--color-orange)";
                      e.currentTarget.style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "";
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.color = "";
                  }}
                >
                  <ArrowLeft size={15} />
                </button>
                <span
                  className="font-body text-sm"
                  style={{ color: "var(--color-muted)" }}
                >
                  Page{" "}
                  <strong style={{ color: "var(--color-orange)" }}>
                    {page}
                  </strong>{" "}
                  of {pageCount}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page === pageCount}
                  className="p-2.5 rounded-lg border transition-all disabled:opacity-30"
                  style={{ borderColor: "var(--color-border)" }}
                  onMouseEnter={(e) => {
                    if (page !== pageCount) {
                      e.currentTarget.style.backgroundColor =
                        "var(--color-orange)";
                      e.currentTarget.style.borderColor = "var(--color-orange)";
                      e.currentTarget.style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "";
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.color = "";
                  }}
                >
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-24 space-y-5">
              {/* Categories */}
              <div
                className="bg-white rounded-xl p-5 border"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Tag size={13} style={{ color: "var(--color-orange)" }} />
                  <p className="text-eyebrow">Categories</p>
                </div>
                <div className="section-rule mb-4" />
                <ul className="space-y-1">
                  {categories.map((c) => (
                    <li key={c}>
                      <button
                        onClick={() => {
                          setSelectedCategory(c);
                          setPage(1);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg font-body text-sm font-semibold transition-all"
                        style={{
                          backgroundColor:
                            selectedCategory === c
                              ? "var(--color-orange)"
                              : "transparent",
                          color:
                            selectedCategory === c
                              ? "#fff"
                              : "var(--color-text)",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedCategory !== c)
                            e.currentTarget.style.backgroundColor =
                              "var(--color-bg-soft)";
                        }}
                        onMouseLeave={(e) => {
                          if (selectedCategory !== c)
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                        }}
                      >
                        {c}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div
                className="bg-white rounded-xl p-5 border"
                style={{ borderColor: "var(--color-border)" }}
              >
                <p className="text-eyebrow mb-1">Popular Topics</p>
                <div className="section-rule mb-4" />
                <div className="flex flex-wrap gap-2">
                  {allTags.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTagClick(t)}
                      className="font-body text-[0.62rem] font-semibold px-2.5 py-1 rounded-full border transition-all"
                      style={{
                        backgroundColor:
                          selectedCategory === t
                            ? "var(--color-orange)"
                            : "transparent",
                        color:
                          selectedCategory === t
                            ? "#fff"
                            : "var(--color-muted)",
                        borderColor:
                          selectedCategory === t
                            ? "var(--color-orange)"
                            : "var(--color-border)",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCategory !== t) {
                          e.currentTarget.style.borderColor =
                            "var(--color-orange)";
                          e.currentTarget.style.color = "var(--color-orange)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCategory !== t) {
                          e.currentTarget.style.borderColor =
                            "var(--color-border)";
                          e.currentTarget.style.color = "var(--color-muted)";
                        }
                      }}
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div
                className="rounded-xl p-5 text-white"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-orange) 0%, var(--color-orange-dark) 100%)",
                }}
              >
                <ChefHat
                  size={22}
                  className="mb-3"
                  style={{ color: "var(--color-orange)" }}
                />
                <p
                  className="text-eyebrow mb-1"
                  style={{ color: "var(--color-orange)" }}
                >
                  Newsletter
                </p>
                <h5 className="font-heading text-sm font-bold text-white mb-1">
                  Get Recipes & Tips
                </h5>
                <p className="font-body text-xs text-white/70 mb-4">
                  Join 5,000+ families enjoying healthier meals.
                </p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full font-body text-xs rounded-lg px-3 py-2.5 text-gray-900 mb-2.5 focus:outline-none"
                  style={{ border: "none" }}
                />
                <button
                  className="btn-secondary w-full text-center"
                  style={{ fontSize: "0.58rem", padding: "0.45rem 1rem" }}
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
