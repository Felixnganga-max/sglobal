import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Package,
  X,
  Upload,
  List,
  ListOrdered,
  AlignLeft,
  Type,
  Save,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  ImagePlus,
} from "lucide-react";
import { productService } from "../api/productService";

// ============================================================================
// PRODUCT FORM MODAL COMPONENT
// ============================================================================
function ProductFormModal({ isOpen, onClose, editProduct, onSave }) {
  const [currentTab, setCurrentTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(
    editProduct || {
      title: "",
      category: "",
      price: "",
      oldPrice: "",
      stock: "",
      badge: "",
      isHalal: true,
      rating: 0,
      reviews: 0,
      shortDescription: "",
    },
  );

  // Each entry: { preview: string, base64: string | null, isExisting: boolean, url?: string }
  const [images, setImages] = useState([]);

  const [descriptionBlocks, setDescriptionBlocks] = useState(
    editProduct?.descriptionBlocks || [],
  );
  const [features, setFeatures] = useState(editProduct?.features || []);
  const [specifications, setSpecifications] = useState(
    editProduct?.specifications || [],
  );

  // Update form when editProduct changes
  useEffect(() => {
    if (editProduct) {
      setFormData({
        title: editProduct.title,
        category: editProduct.category,
        price: editProduct.price,
        oldPrice: editProduct.oldPrice || "",
        stock: editProduct.stock,
        badge: editProduct.badge || "",
        isHalal: editProduct.isHalal,
        rating: editProduct.rating || 0,
        reviews: editProduct.reviews || 0,
        shortDescription: editProduct.shortDescription,
      });

      // Populate existing images from the product
      if (editProduct.images && editProduct.images.length > 0) {
        setImages(
          editProduct.images.map((img) => ({
            preview: img.url,
            base64: null,
            isExisting: true,
            url: img.url,
          })),
        );
      } else {
        setImages([]);
      }

      setDescriptionBlocks(editProduct.descriptionBlocks || []);
      setFeatures(editProduct.features || []);
      setSpecifications(editProduct.specifications || []);
    } else {
      // Reset for new product
      setFormData({
        title: "",
        category: "",
        price: "",
        oldPrice: "",
        stock: "",
        badge: "",
        isHalal: true,
        rating: 0,
        reviews: 0,
        shortDescription: "",
      });
      setImages([]);
      setDescriptionBlocks([]);
      setFeatures([]);
      setSpecifications([]);
    }
  }, [editProduct, isOpen]);

  const categories = [
    "Craft cooked potato chips",
    "Just fruits",
    "Hum Hum",
    "Cakemix",
    "Brownie & Pancake",
    "Whipped creams",
    "Boringer topping sauces",
    "Kent soups",
    "Kent stocks",
    "Kent sauces",
    "Kent syrups",
    "Kent spreads",
    "Kizembe spring water",
  ];

  const badges = ["NEW", "SALE", "HOT", "LIMITED"];

  // ── Image handlers ────────────────────────────────────────────────────────

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const remaining = 10 - images.length;
    if (remaining <= 0) {
      alert("Maximum 10 images allowed");
      return;
    }

    const filesToProcess = files.slice(0, remaining);
    if (files.length > remaining) {
      alert(
        `Only ${remaining} more image(s) can be added. Others were ignored.`,
      );
    }

    filesToProcess.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`"${file.name}" exceeds 10MB and was skipped.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [
          ...prev,
          { preview: reader.result, base64: reader.result, isExisting: false },
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input so the same file can be re-selected if needed
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index, direction) => {
    setImages((prev) => {
      const next = [...prev];
      const target = direction === "left" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  // ── Description blocks ────────────────────────────────────────────────────

  const addDescriptionBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: type === "bullet-list" || type === "ordered-list" ? [""] : "",
    };
    setDescriptionBlocks([...descriptionBlocks, newBlock]);
  };

  const updateDescriptionBlock = (id, content) => {
    setDescriptionBlocks(
      descriptionBlocks.map((block) =>
        block.id === id ? { ...block, content } : block,
      ),
    );
  };

  const removeDescriptionBlock = (id) => {
    setDescriptionBlocks(descriptionBlocks.filter((block) => block.id !== id));
  };

  const moveBlock = (index, direction) => {
    const newBlocks = [...descriptionBlocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newBlocks.length) {
      [newBlocks[index], newBlocks[targetIndex]] = [
        newBlocks[targetIndex],
        newBlocks[index],
      ];
      setDescriptionBlocks(newBlocks);
    }
  };

  const addListItem = (blockId) => {
    setDescriptionBlocks(
      descriptionBlocks.map((block) =>
        block.id === blockId
          ? { ...block, content: [...block.content, ""] }
          : block,
      ),
    );
  };

  const updateListItem = (blockId, itemIndex, value) => {
    setDescriptionBlocks(
      descriptionBlocks.map((block) =>
        block.id === blockId
          ? {
              ...block,
              content: block.content.map((item, i) =>
                i === itemIndex ? value : item,
              ),
            }
          : block,
      ),
    );
  };

  const removeListItem = (blockId, itemIndex) => {
    setDescriptionBlocks(
      descriptionBlocks.map((block) =>
        block.id === blockId
          ? {
              ...block,
              content: block.content.filter((_, i) => i !== itemIndex),
            }
          : block,
      ),
    );
  };

  // ── Features & specs ──────────────────────────────────────────────────────

  const addFeature = () => setFeatures([...features, ""]);
  const updateFeature = (i, v) =>
    setFeatures(features.map((f, idx) => (idx === i ? v : f)));
  const removeFeature = (i) =>
    setFeatures(features.filter((_, idx) => idx !== i));

  const addSpecification = () =>
    setSpecifications([...specifications, { key: "", value: "" }]);
  const updateSpecification = (i, field, v) =>
    setSpecifications(
      specifications.map((s, idx) => (idx === i ? { ...s, [field]: v } : s)),
    );
  const removeSpecification = (i) =>
    setSpecifications(specifications.filter((_, idx) => idx !== i));

  // ── Discount ──────────────────────────────────────────────────────────────

  const calculateDiscount = () => {
    if (formData.price && formData.oldPrice) {
      const d = Math.round(
        ((parseFloat(formData.oldPrice) - parseFloat(formData.price)) /
          parseFloat(formData.oldPrice)) *
          100,
      );
      return d > 0 ? d : null;
    }
    return null;
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert("Please enter a product title");
      return false;
    }
    if (!formData.category) {
      alert("Please select a category");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert("Please enter a valid price");
      return false;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      alert("Please enter a valid stock quantity");
      return false;
    }
    if (!formData.shortDescription.trim()) {
      alert("Please enter a short description");
      return false;
    }
    if (!editProduct && images.length === 0) {
      alert("Please upload at least one product image");
      return false;
    }
    return true;
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const productData = {
        title: formData.title,
        category: formData.category,
        price: parseFloat(formData.price),
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
        stock: parseInt(formData.stock),
        badge: formData.badge || "",
        isHalal: formData.isHalal,
        rating: parseFloat(formData.rating) || 0,
        reviews: parseInt(formData.reviews) || 0,
        shortDescription: formData.shortDescription,
        descriptionBlocks: descriptionBlocks.map((block, index) => ({
          ...block,
          id: index,
        })),
        features: features.filter((f) => f.trim() !== ""),
        specifications: specifications.filter(
          (s) => s.key.trim() !== "" && s.value.trim() !== "",
        ),
      };

      // Only send base64 strings for NEW images (not existing ones)
      const newBase64Images = images
        .filter((img) => !img.isExisting && img.base64)
        .map((img) => img.base64);

      if (newBase64Images.length > 0) {
        productData.imageData = newBase64Images; // array of base64 strings
      }

      await onSave(productData);
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.message || "Failed to save product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2
              className="text-3xl font-black text-gray-900"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {editProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Fill in the product details below
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {["basic", "description", "details"].map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`px-6 py-3 font-bold text-sm transition-all capitalize ${
                currentTab === tab
                  ? "border-b-2 border-[#BF1A1A] text-[#BF1A1A]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "basic"
                ? "Basic Info"
                : tab === "description"
                  ? "Description"
                  : "Features & Specs"}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ── BASIC INFO TAB ─────────────────────────────────────────────── */}
          {currentTab === "basic" && (
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Kent Vegetable Soup"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Badge (Optional)
                  </label>
                  <select
                    value={formData.badge}
                    onChange={(e) =>
                      setFormData({ ...formData, badge: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                  >
                    <option value="">No badge</option>
                    {badges.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price / Old Price / Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      placeholder="0.00"
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Old Price (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.oldPrice}
                      placeholder="0.00"
                      onChange={(e) =>
                        setFormData({ ...formData, oldPrice: e.target.value })
                      }
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    placeholder="0"
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                  />
                </div>
              </div>

              {calculateDiscount() && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-700 font-bold">
                    ✓ Discount: {calculateDiscount()}% off
                  </p>
                </div>
              )}

              {/* Rating & Reviews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: Math.min(5, Math.max(0, e.target.value)),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Number of Reviews
                  </label>
                  <input
                    type="number"
                    value={formData.reviews}
                    placeholder="0"
                    onChange={(e) =>
                      setFormData({ ...formData, reviews: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Halal */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isHalal"
                  checked={formData.isHalal}
                  onChange={(e) =>
                    setFormData({ ...formData, isHalal: e.target.checked })
                  }
                  className="w-5 h-5 text-[#BF1A1A] border-gray-300 rounded focus:ring-[#BF1A1A]"
                />
                <label
                  htmlFor="isHalal"
                  className="text-sm font-bold text-gray-700"
                >
                  Halal Certified
                </label>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  value={formData.shortDescription}
                  rows="3"
                  placeholder="Brief product description (appears on product card)"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent resize-none"
                />
              </div>

              {/* ── MULTI-IMAGE UPLOAD ──────────────────────────────────────── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Product Images * &nbsp;
                    <span className="font-normal text-gray-500">
                      ({images.length}/10) — first image is the cover
                    </span>
                  </label>
                  {images.length < 10 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-[#BF1A1A] text-white rounded-lg hover:bg-[#8B1414] transition-colors text-sm font-bold"
                    >
                      <ImagePlus className="h-4 w-4" />
                      Add Images
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {images.length === 0 ? (
                  /* Empty drop zone */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-[#BF1A1A] transition-colors"
                  >
                    <Upload className="h-12 w-12 text-gray-400 mb-3" />
                    <span className="text-sm font-bold text-gray-600 mb-1">
                      Click to upload images
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, WEBP up to 10MB each · max 10 images
                    </span>
                  </div>
                ) : (
                  /* Image grid */
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {images.map((img, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={img.preview}
                          alt={`Product ${index + 1}`}
                          className={`w-full h-full object-cover rounded-xl border-2 transition-all ${
                            index === 0
                              ? "border-[#BF1A1A] shadow-md"
                              : "border-gray-200"
                          }`}
                        />

                        {/* Cover badge */}
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-[#BF1A1A] text-white text-xs font-black rounded-md">
                            Cover
                          </span>
                        )}

                        {/* Overlay controls */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-xl transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => moveImage(index, "left")}
                            disabled={index === 0}
                            className="p-1.5 bg-white rounded-lg disabled:opacity-30 hover:bg-gray-100 transition-colors"
                            title="Move left"
                          >
                            <ChevronLeft className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            title="Remove"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(index, "right")}
                            disabled={index === images.length - 1}
                            className="p-1.5 bg-white rounded-lg disabled:opacity-30 hover:bg-gray-100 transition-colors"
                            title="Move right"
                          >
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add more tile */}
                    {images.length < 10 && (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#BF1A1A] hover:bg-red-50 transition-all"
                      >
                        <Plus className="h-6 w-6 text-gray-400" />
                        <span className="text-xs text-gray-500 mt-1 font-semibold">
                          Add more
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {images.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Hover over an image to reorder or remove it. The first image
                    is used as the cover.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── DESCRIPTION TAB ───────────────────────────────────────────── */}
          {currentTab === "description" && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-600 font-semibold mb-3">
                  Add Rich Content Blocks
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      type: "paragraph",
                      icon: <AlignLeft className="h-4 w-4" />,
                      label: "Paragraph",
                    },
                    {
                      type: "heading",
                      icon: <Type className="h-4 w-4" />,
                      label: "Heading",
                    },
                    {
                      type: "bullet-list",
                      icon: <List className="h-4 w-4" />,
                      label: "Bullet List",
                    },
                    {
                      type: "ordered-list",
                      icon: <ListOrdered className="h-4 w-4" />,
                      label: "Numbered List",
                    },
                  ].map(({ type, icon, label }) => (
                    <button
                      key={type}
                      onClick={() => addDescriptionBlock(type)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {icon}
                      <span className="text-sm font-bold">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {descriptionBlocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="bg-white border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        {block.type.replace("-", " ")}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveBlock(index, "up")}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveBlock(index, "down")}
                          disabled={index === descriptionBlocks.length - 1}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeDescriptionBlock(block.id)}
                          className="p-1 hover:bg-red-100 rounded text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {block.type === "paragraph" && (
                      <textarea
                        value={block.content}
                        rows="4"
                        placeholder="Write your paragraph here..."
                        onChange={(e) =>
                          updateDescriptionBlock(block.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] resize-none"
                      />
                    )}
                    {block.type === "heading" && (
                      <input
                        type="text"
                        value={block.content}
                        placeholder="Enter heading..."
                        onChange={(e) =>
                          updateDescriptionBlock(block.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] font-bold text-lg"
                      />
                    )}
                    {(block.type === "bullet-list" ||
                      block.type === "ordered-list") && (
                      <div className="space-y-2">
                        {block.content.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center gap-2"
                          >
                            <span className="text-gray-400 font-bold">
                              {block.type === "ordered-list"
                                ? `${itemIndex + 1}.`
                                : "•"}
                            </span>
                            <input
                              type="text"
                              value={item}
                              placeholder="List item..."
                              onChange={(e) =>
                                updateListItem(
                                  block.id,
                                  itemIndex,
                                  e.target.value,
                                )
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                            />
                            {block.content.length > 1 && (
                              <button
                                onClick={() =>
                                  removeListItem(block.id, itemIndex)
                                }
                                className="p-2 hover:bg-red-100 rounded text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => addListItem(block.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold"
                        >
                          <Plus className="h-4 w-4" /> Add Item
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {descriptionBlocks.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 font-semibold">
                      No content blocks yet. Add some using the buttons above!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── FEATURES & SPECS TAB ──────────────────────────────────────── */}
          {currentTab === "details" && (
            <div className="space-y-6">
              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Key Features
                  </h3>
                  <button
                    onClick={addFeature}
                    className="flex items-center gap-2 px-4 py-2 bg-[#BF1A1A] text-white rounded-lg hover:bg-[#8B1414] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Feature
                  </button>
                </div>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-[#BF1A1A] font-bold">✓</span>
                      <input
                        type="text"
                        value={feature}
                        placeholder="e.g., 100% natural ingredients"
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                      />
                      <button
                        onClick={() => removeFeature(index)}
                        className="p-3 hover:bg-red-100 rounded-lg text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {features.length === 0 && (
                    <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-xl">
                      No features added yet
                    </p>
                  )}
                </div>
              </div>

              {/* Specifications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Specifications
                  </h3>
                  <button
                    onClick={addSpecification}
                    className="flex items-center gap-2 px-4 py-2 bg-[#BF1A1A] text-white rounded-lg hover:bg-[#8B1414] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Specification
                  </button>
                </div>
                <div className="space-y-3">
                  {specifications.map((spec, index) => (
                    <div key={index} className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={spec.key}
                        placeholder="e.g., Weight"
                        onChange={(e) =>
                          updateSpecification(index, "key", e.target.value)
                        }
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                      />
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={spec.value}
                          placeholder="e.g., 500g"
                          onChange={(e) =>
                            updateSpecification(index, "value", e.target.value)
                          }
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                        />
                        <button
                          onClick={() => removeSpecification(index)}
                          className="p-3 hover:bg-red-100 rounded-lg text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {specifications.length === 0 && (
                    <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-xl">
                      No specifications added yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" /> Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#BF1A1A] to-[#8B1414] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />{" "}
                {editProduct ? "Update Product" : "Save Product"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PRODUCT CARD COMPONENT
// ============================================================================
function ProductCard({ product, onEdit, onDelete, onView }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Support both `images` array (new) and legacy `image` object
  const imageList =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

  const imageUrl =
    imageList[activeIndex]?.url ||
    "https://via.placeholder.com/300x300?text=No+Image";

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className="relative mb-4">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-48 object-contain rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-4"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300x300?text=Image+Error";
          }}
        />

        {/* Multi-image dot indicators */}
        {imageList.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {imageList.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeIndex
                    ? "bg-[#BF1A1A] w-4"
                    : "bg-white bg-opacity-80"
                }`}
              />
            ))}
          </div>
        )}

        {/* Prev / Next arrows (only shown on hover when multiple images) */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              disabled={activeIndex === 0}
              className="absolute left-1 top-1/2 -translate-y-1/2 p-1 bg-white bg-opacity-80 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() =>
                setActiveIndex((i) => Math.min(imageList.length - 1, i + 1))
              }
              disabled={activeIndex === imageList.length - 1}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-white bg-opacity-80 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        <div className="absolute top-2 right-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        {product.badge && (
          <div className="absolute top-2 left-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black ${
                product.badge === "NEW"
                  ? "bg-[#4CAF50] text-white"
                  : product.badge === "SALE"
                    ? "bg-[#BF1A1A] text-white"
                    : product.badge === "HOT"
                      ? "bg-[#FFD41D] text-[#7B4019]"
                      : "bg-gray-800 text-white"
              }`}
            >
              {product.badge}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-gray-900 line-clamp-1">
          {product.title}
        </h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <div className="flex items-center justify-between">
          <span
            className="text-2xl font-black text-[#BF1A1A]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#BF1A1A] text-white rounded-lg hover:bg-[#8B1414] transition-colors"
        >
          <Edit2 className="h-4 w-4" />
          <span className="text-sm font-bold">Edit</span>
        </button>
        <button
          onClick={() => onView(product)}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD PRODUCTS COMPONENT
// ============================================================================
export default function DashboardProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStockProducts: 0,
    outOfStockProducts: 0,
  });

  const categories = [
    "All Products",
    "Soups",
    "Pancake Mixes",
    "Stock Cubes",
    "Syrups & Sauces",
    "Craft Cooked Crisps",
    "Baby Pouches",
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);
  useEffect(() => {
    fetchStats();
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = { page: 1, limit: 100 };
      if (searchQuery) params.search = searchQuery;
      if (
        selectedCategory &&
        selectedCategory !== "all" &&
        selectedCategory !== "all-products"
      ) {
        params.category = selectedCategory;
      }

      const response = await productService.getAllProducts(params);
      if (response.success) {
        setProducts(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch products");
      }
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = () => {
    setStats({
      totalProducts: products.length,
      inStockProducts: products.filter((p) => p.inStock).length,
      outOfStockProducts: products.filter((p) => !p.inStock).length,
    });
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };
  const handleViewProduct = (product) => {
    console.log("View product:", product);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const response = await productService.deleteProduct(id);
      if (response.success) {
        setProducts(products.filter((p) => p._id !== id));
        alert("Product deleted successfully!");
      } else {
        throw new Error(response.message || "Failed to delete product");
      }
    } catch (err) {
      alert(err.message || "Failed to delete product");
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        const response = await productService.updateProduct(
          editingProduct._id,
          productData,
        );
        if (response.success) {
          setProducts(
            products.map((p) =>
              p._id === editingProduct._id ? response.data : p,
            ),
          );
          alert("Product updated successfully!");
        } else {
          throw new Error(response.message || "Failed to update product");
        }
      } else {
        const response = await productService.createProduct(productData);
        if (response.success) {
          setProducts([response.data, ...products]);
          alert("Product created successfully!");
        } else {
          throw new Error(response.message || "Failed to create product");
        }
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-4xl font-black text-gray-900 mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Products
          </h1>
          <p className="text-gray-600 font-semibold">
            Manage your product inventory
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#BF1A1A] to-[#8B1414] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-5 w-5" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category.toLowerCase().replace(/ /g, "-"))
                }
                className={`px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 ${
                  selectedCategory ===
                    category.toLowerCase().replace(/ /g, "-") ||
                  (category === "All Products" && selectedCategory === "all")
                    ? "bg-[#BF1A1A] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Products",
            value: stats.totalProducts,
            color: "bg-[#BF1A1A]",
          },
          {
            label: "In Stock",
            value: stats.inStockProducts,
            color: "bg-green-600",
          },
          {
            label: "Out of Stock",
            value: stats.outOfStockProducts,
            color: "bg-red-600",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-4 border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}
              >
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold">{label}</p>
                <p
                  className="text-2xl font-black text-gray-900"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-12 w-12 text-[#BF1A1A] animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-bold text-red-900">Error Loading Products</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchProducts}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading &&
        !error &&
        (products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onView={handleViewProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by adding your first product"}
            </p>
            {!searchQuery && selectedCategory === "all" && (
              <button
                onClick={handleAddProduct}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#BF1A1A] text-white rounded-xl font-bold hover:bg-[#8B1414] transition-colors"
              >
                <Plus className="h-5 w-5" /> Add Your First Product
              </button>
            )}
          </div>
        ))}

      {/* Modal */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        editProduct={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
