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
import { assets } from "../assets/assets";
import blogsData from "../lib/data";

/**
 * Blogs.jsx - Smart Global Premium Foods
 * SEO-Optimized food industry blog with halal products focus
 */

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
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
          p.tags.some((tag) =>
            tag.toLowerCase().includes(selectedCategory.toLowerCase()),
          ),
      );
    }
    if (q) {
      res = res.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q)),
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

  // Individual post view
  if (currentPost) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <article className="max-w-4xl mx-auto px-6 py-12 mt-32">
          <button
            onClick={closePost}
            className="mb-8 flex items-center gap-2 text-gray-600 hover:text-[#BF1A1A] font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </button>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#BF1A1A] to-[#8B1414] text-white text-xs font-black uppercase tracking-wider rounded-full">
                {currentPost.category}
              </span>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{currentPost.readTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  <span>{currentPost.views} views</span>
                </div>
              </div>
            </div>

            <h1
              className="text-4xl md:text-5xl font-black mb-6 text-gray-900 leading-tight"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {currentPost.title}
            </h1>

            <div className="flex items-center justify-between py-6 border-y border-gray-200">
              <div className="flex items-center gap-4">
                <img
                  src={currentPost.author.avatar}
                  alt={currentPost.author.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-gray-900">
                    {currentPost.author.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(currentPost.publishDate)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-red-50 rounded-full transition-colors">
                  <Heart size={20} className="text-[#BF1A1A]" />
                </button>
                <button className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                  <Share2 size={20} className="text-blue-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={currentPost.featuredImage}
              alt={currentPost.title}
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            {currentPost.content.map((block, idx) => {
              if (block.type === "paragraph") {
                return (
                  <p
                    key={idx}
                    className="text-gray-700 leading-relaxed mb-6 text-lg"
                  >
                    {block.text}
                  </p>
                );
              }
              if (block.type === "heading") {
                return (
                  <h2
                    key={idx}
                    className="text-3xl font-black text-gray-900 mt-12 mb-6"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "subheading") {
                return (
                  <h3
                    key={idx}
                    className="text-2xl font-bold text-[#BF1A1A] mt-8 mb-4"
                  >
                    {block.text}
                  </h3>
                );
              }
              return null;
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-4 font-semibold">
              Related Topics
            </div>
            <div className="flex flex-wrap gap-2">
              {currentPost.tags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => {
                    closePost();
                    handleTagClick(tag);
                  }}
                  className="px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-full border-2 border-gray-200 hover:border-[#BF1A1A] hover:text-[#BF1A1A] transition-all cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    );
  }

  // Main blog listing view
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#BF1A1A] to-[#8B1414] text-white py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="text-[#FFD41D]" size={32} />
              <span className="text-[#FFD41D] font-bold uppercase tracking-wider text-sm">
                Smart Global Blog
              </span>
            </div>
            <h1
              className="text-5xl md:text-6xl font-black mb-6"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              FOOD, NUTRITION &<br />
              <span className="text-[#FFD41D]">HEALTHY LIVING</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Expert tips, delicious recipes, and nutrition guides for modern
              families who value quality halal food
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search & Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div className="flex items-center gap-6">
            <div className="text-gray-600">
              <span className="font-bold text-[#BF1A1A] text-2xl">
                {filtered.length}
              </span>{" "}
              articles
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-96">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search recipes, tips, products..."
                className="w-full pl-12 pr-6 py-3 rounded-full bg-white border-2 border-gray-200 focus:border-[#BF1A1A] focus:outline-none transition-all shadow-sm"
              />
            </div>
            {(query || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-[#BF1A1A] font-semibold"
              >
                Clear
              </button>
            )}
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => setView("grid")}
                className={`p-3 rounded-xl transition-all ${
                  view === "grid"
                    ? "bg-[#BF1A1A] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <GridIcon size={20} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-3 rounded-xl transition-all ${
                  view === "list"
                    ? "bg-[#BF1A1A] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <ListIcon size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <main className="lg:col-span-2">
            {paginated.length === 0 ? (
              <div className="py-24 text-center">
                <Utensils size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-bold mb-3">No articles found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
                    : "flex flex-col gap-6"
                }
              >
                {paginated.map((post) => (
                  <article
                    key={post.id}
                    onClick={() => openPost(post)}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group border-2 border-gray-100 hover:border-[#BF1A1A]"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <span className="inline-block px-3 py-1.5 bg-[#BF1A1A] text-white text-xs font-bold uppercase rounded-full mb-4">
                        {post.category}
                      </span>
                      <h3 className="text-xl font-black mb-3 text-gray-900 line-clamp-2 group-hover:text-[#BF1A1A] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>{formatDate(post.publishDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm font-semibold text-gray-900">
                          {post.author.name}
                        </span>
                        <span className="text-[#BF1A1A] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read More
                          <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {paginated.length > 0 && pageCount > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 rounded-xl bg-white shadow-md disabled:opacity-40 hover:bg-[#BF1A1A] hover:text-white transition-all"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="text-sm font-semibold">
                  Page <span className="text-[#BF1A1A] text-lg">{page}</span> of{" "}
                  {pageCount}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page === pageCount}
                  className="p-3 rounded-xl bg-white shadow-md disabled:opacity-40 hover:bg-[#BF1A1A] hover:text-white transition-all"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h4 className="text-sm text-gray-600 mb-4 uppercase tracking-wider font-bold flex items-center gap-2">
                  <Tag size={16} className="text-[#BF1A1A]" />
                  Categories
                </h4>
                <ul className="space-y-2">
                  {categories.map((c) => (
                    <li key={c}>
                      <button
                        onClick={() => {
                          setSelectedCategory(c);
                          setPage(1);
                        }}
                        className={`w-full text-left py-3 px-4 rounded-xl font-semibold transition-all ${
                          selectedCategory === c
                            ? "bg-[#BF1A1A] text-white"
                            : "hover:bg-gray-100 text-gray-900"
                        }`}
                      >
                        {c}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h4 className="text-sm text-gray-600 mb-4 uppercase tracking-wider font-bold">
                  Popular Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTagClick(t)}
                      className={`text-xs px-3 py-2 rounded-full font-semibold transition-all ${
                        selectedCategory === t
                          ? "bg-[#BF1A1A] text-white"
                          : "bg-gray-100 text-gray-900 hover:bg-[#BF1A1A] hover:text-white"
                      }`}
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-[#BF1A1A] to-[#8B1414] rounded-2xl p-6 text-white shadow-2xl">
                <ChefHat size={32} className="mb-4 text-[#FFD41D]" />
                <h5
                  className="text-xl font-black mb-2"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  GET RECIPES & TIPS
                </h5>
                <p className="text-sm text-white/90 mb-6">
                  Join 5,000+ families enjoying healthier meals
                </p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-xl px-4 py-3 text-gray-900 mb-3 focus:outline-none focus:ring-2 focus:ring-[#FFD41D]"
                />
                <button className="w-full bg-[#FFD41D] text-[#BF1A1A] px-6 py-3 rounded-xl font-black uppercase text-sm hover:bg-white transition-all">
                  Subscribe Now
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;600;700;800;900&display=swap");
      `}</style>
    </div>
  );
}
