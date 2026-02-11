import React, { useState, useRef } from "react";
import {
  Plus,
  Save,
  Eye,
  Trash2,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Code,
  Heading1,
  Heading2,
  FileText,
  X,
  Calendar,
  Tag,
  User,
  CheckCircle,
  Clock,
  Edit3,
  Upload,
} from "lucide-react";
import blogsData from "../lib/data";

/**
 * DashboardBlogs.jsx - Smart Global Admin Blog Editor
 * Full-featured blog creation and management interface
 * Colors: Red (#BF1A1A), Yellow (#FFD41D), Black, White, Brown (#7B4019)
 */

export default function DashboardBlogs() {
  const [view, setView] = useState("list"); // 'list' or 'edit'
  const [blogs, setBlogs] = useState(blogsData.blogs);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [blogMeta, setBlogMeta] = useState({
    title: "",
    slug: "",
    category: "",
    tags: [],
    excerpt: "",
    featuredImage: null,
    author: "Smart Global Team",
  });
  const [tagInput, setTagInput] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePosition, setImagePosition] = useState(null);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // Create new blog
  const handleNewBlog = () => {
    setCurrentBlog(null);
    setBlogMeta({
      title: "",
      slug: "",
      category: "",
      tags: [],
      excerpt: "",
      featuredImage: null,
      author: "Smart Global Team",
    });
    setEditorContent("");
    setView("edit");
  };

  // Edit existing blog
  const handleEditBlog = (blog) => {
    setCurrentBlog(blog);
    setBlogMeta({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      tags: blog.tags,
      excerpt: blog.excerpt,
      featuredImage: blog.featuredImage,
      author: blog.author.name,
    });
    // Convert content array to HTML-like string for editing
    const contentHtml = blog.content
      .map((block) => {
        if (block.type === "heading") return `<h2>${block.text}</h2>`;
        if (block.type === "subheading") return `<h3>${block.text}</h3>`;
        if (block.type === "paragraph") return `<p>${block.text}</p>`;
        return "";
      })
      .join("\n\n");
    setEditorContent(contentHtml);
    setView("edit");
  };

  // Delete blog
  const handleDeleteBlog = (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      setBlogs(blogs.filter((b) => b.id !== id));
    }
  };

  // Save blog
  const handleSaveBlog = () => {
    if (!blogMeta.title || !blogMeta.category || !editorContent) {
      alert("Please fill in all required fields (Title, Category, Content)");
      return;
    }

    // Generate slug from title if not provided
    const slug =
      blogMeta.slug ||
      blogMeta.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // Parse editor content into content blocks
    const contentBlocks = parseContentToBlocks(editorContent);

    const blogData = {
      id: currentBlog ? currentBlog.id : blogs.length + 1,
      title: blogMeta.title,
      slug: slug,
      metaTitle: `${blogMeta.title} | Smart Global Kenya`,
      metaDescription: blogMeta.excerpt,
      keywords: blogMeta.tags,
      author: {
        name: blogMeta.author,
        role: "FMCG Product Specialists",
        avatar: "assets.logo",
      },
      publishDate: currentBlog
        ? currentBlog.publishDate
        : new Date().toISOString().split("T")[0],
      readTime: calculateReadTime(editorContent),
      category: blogMeta.category,
      tags: blogMeta.tags,
      excerpt: blogMeta.excerpt,
      featuredImage: blogMeta.featuredImage || "assets.kent",
      content: contentBlocks,
      views: currentBlog ? currentBlog.views : 0,
      likes: currentBlog ? currentBlog.likes : 0,
      comments: currentBlog ? currentBlog.comments : 0,
      relatedProducts: [],
    };

    if (currentBlog) {
      // Update existing
      setBlogs(blogs.map((b) => (b.id === currentBlog.id ? blogData : b)));
    } else {
      // Add new
      setBlogs([...blogs, blogData]);
    }

    alert("Blog saved successfully!");
    setView("list");
  };

  // Parse HTML content to content blocks
  const parseContentToBlocks = (html) => {
    const blocks = [];
    const div = document.createElement("div");
    div.innerHTML = html;

    div.childNodes.forEach((node) => {
      if (node.nodeName === "H2") {
        blocks.push({ type: "heading", text: node.textContent });
      } else if (node.nodeName === "H3") {
        blocks.push({ type: "subheading", text: node.textContent });
      } else if (node.nodeName === "P" && node.textContent.trim()) {
        blocks.push({ type: "paragraph", text: node.textContent });
      } else if (node.nodeName === "IMG") {
        blocks.push({
          type: "image",
          src: node.getAttribute("src"),
          alt: node.getAttribute("alt") || "",
        });
      }
    });

    return blocks;
  };

  // Calculate read time
  const calculateReadTime = (content) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  // Add tag
  const handleAddTag = () => {
    if (tagInput.trim() && !blogMeta.tags.includes(tagInput.trim())) {
      setBlogMeta({
        ...blogMeta,
        tags: [...blogMeta.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  // Remove tag
  const handleRemoveTag = (tag) => {
    setBlogMeta({
      ...blogMeta,
      tags: blogMeta.tags.filter((t) => t !== tag),
    });
  };

  // Insert image
  const handleInsertImage = () => {
    if (!imageUrl) return;

    const editor = editorRef.current;
    if (!editor) return;

    const imageHtml = `<img src="${imageUrl}" alt="Blog image" class="w-full rounded-xl my-6" />`;

    // Insert at cursor position
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const img = document.createElement("div");
      img.innerHTML = imageHtml;
      range.insertNode(img.firstChild);
    } else {
      // Append to end if no selection
      setEditorContent(editorContent + "\n" + imageHtml);
    }

    setImageUrl("");
    setShowImageModal(false);
  };

  // Format text
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogMeta({ ...blogMeta, featuredImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // List View
  if (view === "list") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="text-4xl font-black text-[#BF1A1A] mb-2"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                BLOG MANAGEMENT
              </h1>
              <p className="text-gray-600">
                Create and manage blog posts for Smart Global
              </p>
            </div>
            <button
              onClick={handleNewBlog}
              className="flex items-center gap-2 bg-[#BF1A1A] hover:bg-[#8B1414] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              New Blog Post
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<FileText className="text-[#BF1A1A]" size={24} />}
              label="Total Posts"
              value={blogs.length}
              color="red"
            />
            <StatCard
              icon={<Eye className="text-blue-600" size={24} />}
              label="Total Views"
              value={blogs
                .reduce((sum, b) => sum + b.views, 0)
                .toLocaleString()}
              color="blue"
            />
            <StatCard
              icon={<CheckCircle className="text-green-600" size={24} />}
              label="Published"
              value={blogs.length}
              color="green"
            />
            <StatCard
              icon={<Clock className="text-orange-600" size={24} />}
              label="Drafts"
              value={0}
              color="orange"
            />
          </div>

          {/* Blog List */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr
                      key={blog.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-bold text-gray-900 line-clamp-1">
                              {blog.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {blog.readTime}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-[#BF1A1A] text-white text-xs font-bold rounded-full">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(blog.publishDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Eye size={14} />
                          <span>{blog.views.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          Published
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditBlog(blog)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                            title="Edit"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600"
                            title="Preview"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Editor View
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-4xl font-black text-[#BF1A1A] mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {currentBlog ? "EDIT BLOG POST" : "CREATE NEW BLOG POST"}
            </h1>
            <p className="text-gray-600">Write and format your blog content</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView("list")}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBlog}
              className="flex items-center gap-2 bg-[#BF1A1A] hover:bg-[#8B1414] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
            >
              <Save size={20} />
              Save Blog
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Blog Title *
              </label>
              <input
                type="text"
                value={blogMeta.title}
                onChange={(e) =>
                  setBlogMeta({ ...blogMeta, title: e.target.value })
                }
                placeholder="Enter an engaging title..."
                className="w-full px-4 py-3 text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-[#BF1A1A] focus:outline-none transition-all"
              />
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Featured Image
              </label>
              <div className="space-y-4">
                {blogMeta.featuredImage ? (
                  <div className="relative">
                    <img
                      src={blogMeta.featuredImage}
                      alt="Featured"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <button
                      onClick={() =>
                        setBlogMeta({ ...blogMeta, featuredImage: null })
                      }
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-[#BF1A1A] transition-colors"
                  >
                    <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 font-semibold mb-2">
                      Click to upload featured image
                    </p>
                    <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
              {/* Toolbar */}
              <div className="bg-gray-50 border-b-2 border-gray-200 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <ToolbarButton
                    icon={<Heading1 size={18} />}
                    onClick={() => formatText("formatBlock", "<h2>")}
                    title="Heading 1"
                  />
                  <ToolbarButton
                    icon={<Heading2 size={18} />}
                    onClick={() => formatText("formatBlock", "<h3>")}
                    title="Heading 2"
                  />
                  <div className="w-px h-6 bg-gray-300" />
                  <ToolbarButton
                    icon={<Bold size={18} />}
                    onClick={() => formatText("bold")}
                    title="Bold"
                  />
                  <ToolbarButton
                    icon={<Italic size={18} />}
                    onClick={() => formatText("italic")}
                    title="Italic"
                  />
                  <div className="w-px h-6 bg-gray-300" />
                  <ToolbarButton
                    icon={<AlignLeft size={18} />}
                    onClick={() => formatText("justifyLeft")}
                    title="Align Left"
                  />
                  <ToolbarButton
                    icon={<AlignCenter size={18} />}
                    onClick={() => formatText("justifyCenter")}
                    title="Align Center"
                  />
                  <ToolbarButton
                    icon={<AlignRight size={18} />}
                    onClick={() => formatText("justifyRight")}
                    title="Align Right"
                  />
                  <div className="w-px h-6 bg-gray-300" />
                  <ToolbarButton
                    icon={<List size={18} />}
                    onClick={() => formatText("insertUnorderedList")}
                    title="Bullet List"
                  />
                  <ToolbarButton
                    icon={<Quote size={18} />}
                    onClick={() => formatText("formatBlock", "<blockquote>")}
                    title="Quote"
                  />
                  <ToolbarButton
                    icon={<LinkIcon size={18} />}
                    onClick={() => {
                      const url = prompt("Enter URL:");
                      if (url) formatText("createLink", url);
                    }}
                    title="Insert Link"
                  />
                  <div className="w-px h-6 bg-gray-300" />
                  <ToolbarButton
                    icon={<ImageIcon size={18} />}
                    onClick={() => setShowImageModal(true)}
                    title="Insert Image"
                    primary
                  />
                </div>
              </div>

              {/* Editor Content */}
              <div
                ref={editorRef}
                contentEditable
                onInput={(e) => setEditorContent(e.currentTarget.innerHTML)}
                className="p-6 min-h-[500px] focus:outline-none prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: editorContent }}
                suppressContentEditableWarning
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Excerpt */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                value={blogMeta.excerpt}
                onChange={(e) =>
                  setBlogMeta({ ...blogMeta, excerpt: e.target.value })
                }
                placeholder="Brief description for previews..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BF1A1A] focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Category */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={blogMeta.category}
                onChange={(e) =>
                  setBlogMeta({ ...blogMeta, category: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BF1A1A] focus:outline-none transition-all font-semibold"
              >
                <option value="">Select category...</option>
                {blogsData.categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="Add tag..."
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#BF1A1A] focus:outline-none transition-all"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-[#BF1A1A] text-white rounded-lg font-bold hover:bg-[#8B1414] transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {blogMeta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* SEO Slug */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                URL Slug (Optional)
              </label>
              <input
                type="text"
                value={blogMeta.slug}
                onChange={(e) =>
                  setBlogMeta({ ...blogMeta, slug: e.target.value })
                }
                placeholder="auto-generated-from-title"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BF1A1A] focus:outline-none transition-all font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Leave blank to auto-generate from title
              </p>
            </div>

            {/* Author */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={blogMeta.author}
                onChange={(e) =>
                  setBlogMeta({ ...blogMeta, author: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BF1A1A] focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Image Insert Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">
                Insert Image
              </h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#BF1A1A] focus:outline-none transition-all"
                />
              </div>
              {imageUrl && (
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full rounded-lg"
                    onError={(e) => {
                      e.target.src = "";
                      e.target.alt = "Invalid image URL";
                    }}
                  />
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowImageModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInsertImage}
                  className="flex-1 px-6 py-3 bg-[#BF1A1A] hover:bg-[#8B1414] text-white rounded-xl font-bold transition-all"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    red: "bg-red-50 border-red-200",
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    orange: "bg-orange-50 border-orange-200",
  };

  return (
    <div
      className={`${colorClasses[color]} border-2 rounded-2xl p-6 shadow-md`}
    >
      <div className="flex items-center justify-between mb-3">{icon}</div>
      <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600 font-semibold">{label}</div>
    </div>
  );
}

function ToolbarButton({ icon, onClick, title, primary }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-all ${
        primary
          ? "bg-[#BF1A1A] text-white hover:bg-[#8B1414]"
          : "hover:bg-gray-200 text-gray-700"
      }`}
    >
      {icon}
    </button>
  );
}
