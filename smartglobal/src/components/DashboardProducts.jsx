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
  Layers,
  SlidersHorizontal,
  Star,
  TrendingUp,
  ShoppingBag,
  BarChart3,
  CheckCircle2,
  XCircle,
  Tag,
  Filter,
  RefreshCw,
} from "lucide-react";
import { productService } from "../api/productService";

// ============================================================================
// CONSTANTS
// ============================================================================
const CATEGORIES = [
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

const BADGES = ["SPECIAL OFFER", "HOT DEALS", "LIMITED OFFER"];

const BADGE_STYLES = {
  "SPECIAL OFFER": "bg-emerald-500 text-white",
  "HOT DEALS": "bg-amber-400 text-amber-900",
  "LIMITED OFFER": "bg-[#BF1A1A] text-white",
};

// ============================================================================
// PRODUCT FORM MODAL
// ============================================================================
function ProductFormModal({ isOpen, onClose, editProduct, onSave }) {
  const [currentTab, setCurrentTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const emptyForm = {
    title: "",
    category: "",
    price: "",
    minimumOrderQuantity: "",
    stock: "",
    badge: "",
    isHalal: true,
    rating: 0,
    reviews: 0,
    shortDescription: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [descriptionBlocks, setDescriptionBlocks] = useState([]);
  const [features, setFeatures] = useState([]);
  const [specifications, setSpecifications] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    setCurrentTab("basic");
    if (editProduct) {
      setFormData({
        title: editProduct.title,
        category: editProduct.category,
        price: editProduct.price,
        minimumOrderQuantity: editProduct.minimumOrderQuantity || 1,
        stock: editProduct.stock,
        badge: editProduct.badge || "",
        isHalal: editProduct.isHalal,
        rating: editProduct.rating || 0,
        reviews: editProduct.reviews || 0,
        shortDescription: editProduct.shortDescription,
      });
      setImages(
        editProduct.images?.length
          ? editProduct.images.map((img) => ({
              preview: img.url,
              base64: null,
              isExisting: true,
              url: img.url,
            }))
          : [],
      );
      setDescriptionBlocks(editProduct.descriptionBlocks || []);
      setFeatures(editProduct.features || []);
      setSpecifications(editProduct.specifications || []);
    } else {
      setFormData(emptyForm);
      setImages([]);
      setDescriptionBlocks([]);
      setFeatures([]);
      setSpecifications([]);
    }
  }, [editProduct, isOpen]);

  const computedTotalPrice =
    formData.price && formData.minimumOrderQuantity
      ? (
          parseFloat(formData.price) * parseInt(formData.minimumOrderQuantity)
        ).toFixed(2)
      : null;

  // Image handlers
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const remaining = 10 - images.length;
    if (remaining <= 0) {
      alert("Maximum 10 images allowed");
      return;
    }
    const toProcess = files.slice(0, remaining);
    if (files.length > remaining)
      alert(`Only ${remaining} more image(s) can be added.`);
    toProcess.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`"${file.name}" exceeds 10MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () =>
        setImages((prev) => [
          ...prev,
          { preview: reader.result, base64: reader.result, isExisting: false },
        ]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (i) =>
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  const moveImage = (i, dir) => {
    setImages((prev) => {
      const next = [...prev];
      const t = dir === "left" ? i - 1 : i + 1;
      if (t < 0 || t >= next.length) return prev;
      [next[i], next[t]] = [next[t], next[i]];
      return next;
    });
  };

  // Description blocks
  const addDescriptionBlock = (type) =>
    setDescriptionBlocks([
      ...descriptionBlocks,
      {
        id: Date.now(),
        type,
        content: type === "bullet-list" || type === "ordered-list" ? [""] : "",
      },
    ]);
  const updateDescriptionBlock = (id, content) =>
    setDescriptionBlocks(
      descriptionBlocks.map((b) => (b.id === id ? { ...b, content } : b)),
    );
  const removeDescriptionBlock = (id) =>
    setDescriptionBlocks(descriptionBlocks.filter((b) => b.id !== id));
  const moveBlock = (index, dir) => {
    const next = [...descriptionBlocks];
    const t = dir === "up" ? index - 1 : index + 1;
    if (t >= 0 && t < next.length) {
      [next[index], next[t]] = [next[t], next[index]];
      setDescriptionBlocks(next);
    }
  };
  const addListItem = (id) =>
    setDescriptionBlocks(
      descriptionBlocks.map((b) =>
        b.id === id ? { ...b, content: [...b.content, ""] } : b,
      ),
    );
  const updateListItem = (id, i, v) =>
    setDescriptionBlocks(
      descriptionBlocks.map((b) =>
        b.id === id
          ? {
              ...b,
              content: b.content.map((item, idx) => (idx === i ? v : item)),
            }
          : b,
      ),
    );
  const removeListItem = (id, i) =>
    setDescriptionBlocks(
      descriptionBlocks.map((b) =>
        b.id === id
          ? { ...b, content: b.content.filter((_, idx) => idx !== i) }
          : b,
      ),
    );

  // Features & specs
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

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert("Product title is required");
      return false;
    }
    if (!formData.category) {
      alert("Please select a category");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert("Enter a valid price");
      return false;
    }
    if (
      !formData.minimumOrderQuantity ||
      parseInt(formData.minimumOrderQuantity) < 1
    ) {
      alert("Minimum order quantity must be at least 1");
      return false;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      alert("Enter a valid stock quantity");
      return false;
    }
    if (!formData.shortDescription.trim()) {
      alert("Short description is required");
      return false;
    }
    if (!editProduct && images.length === 0) {
      alert("Upload at least one product image");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const productData = {
        title: formData.title,
        category: formData.category,
        price: parseFloat(formData.price),
        minimumOrderQuantity: parseInt(formData.minimumOrderQuantity),
        stock: parseInt(formData.stock),
        badge: formData.badge || "",
        isHalal: formData.isHalal,
        rating: parseFloat(formData.rating) || 0,
        reviews: parseInt(formData.reviews) || 0,
        shortDescription: formData.shortDescription,
        descriptionBlocks: descriptionBlocks.map((b, i) => ({ ...b, id: i })),
        features: features.filter((f) => f.trim() !== ""),
        specifications: specifications.filter(
          (s) => s.key.trim() !== "" && s.value.trim() !== "",
        ),
      };
      const newImages = images
        .filter((img) => !img.isExisting && img.base64)
        .map((img) => img.base64);
      if (newImages.length > 0) productData.imageData = newImages;
      await onSave(productData);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const TABS = [
    { id: "basic", label: "Basic Info", step: 1 },
    { id: "description", label: "Description", step: 2 },
    { id: "details", label: "Features & Specs", step: 3 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#BF1A1A] flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {editProduct
                  ? `Editing: ${editProduct.title}`
                  : "Fill in the details to add a new product"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Step Tabs */}
        <div className="flex items-center gap-1 px-7 py-3 border-b border-gray-100 bg-gray-50/60">
          {TABS.map((tab, idx) => (
            <React.Fragment key={tab.id}>
              <button
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  currentTab === tab.id
                    ? "bg-[#BF1A1A] text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                    currentTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.step}
                </span>
                {tab.label}
              </button>
              {idx < TABS.length - 1 && (
                <ChevronRight className="h-3 w-3 text-gray-300 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-7">
          {/* ─── BASIC INFO ─── */}
          {currentTab === "basic" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Curry Powder 100g Jar"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] transition-all text-sm bg-white"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    Badge
                  </label>
                  <select
                    value={formData.badge}
                    onChange={(e) =>
                      setFormData({ ...formData, badge: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] transition-all text-sm bg-white"
                  >
                    <option value="">No badge</option>
                    {BADGES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    Unit Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      KSh
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      placeholder="0.00"
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] transition-all text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    Min. Order Qty *
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={formData.minimumOrderQuantity}
                      placeholder="e.g. 6"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minimumOrderQuantity: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] transition-all text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    Stock Qty *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    placeholder="0"
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] transition-all text-sm"
                  />
                </div>
              </div>

              {computedTotalPrice && (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-orange-100 bg-orange-50">
                  <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                    ×{formData.minimumOrderQuantity}
                  </div>
                  <div>
                    <p className="text-orange-900 font-black text-base">
                      Pack Price: KSh {computedTotalPrice}
                    </p>
                    <p className="text-orange-600 text-xs mt-0.5">
                      {formData.minimumOrderQuantity} pcs × KSh{" "}
                      {parseFloat(formData.price || 0).toFixed(2)} — computed
                      automatically
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    Rating (0–5)
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    Number of Reviews
                  </label>
                  <input
                    type="number"
                    value={formData.reviews}
                    placeholder="0"
                    onChange={(e) =>
                      setFormData({ ...formData, reviews: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] transition-all text-sm"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <div
                  className={`w-10 h-6 rounded-full transition-all relative flex-shrink-0 ${formData.isHalal ? "bg-emerald-500" : "bg-gray-200"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.isHalal ? "left-5" : "left-1"}`}
                  />
                </div>
                <input
                  type="checkbox"
                  checked={formData.isHalal}
                  className="sr-only"
                  onChange={(e) =>
                    setFormData({ ...formData, isHalal: e.target.checked })
                  }
                />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                  Halal Certified
                </span>
              </label>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  Short Description *
                </label>
                <textarea
                  value={formData.shortDescription}
                  rows="3"
                  placeholder="Brief product description shown on product cards..."
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] transition-all resize-none text-sm"
                />
              </div>

              {/* Image Upload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Product Images *&nbsp;
                    <span className="font-normal text-gray-400 normal-case tracking-normal">
                      ({images.length}/10) · first is cover
                    </span>
                  </label>
                  {images.length < 10 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#BF1A1A] text-white rounded-lg hover:bg-[#8B1414] transition-colors text-xs font-bold"
                    >
                      <ImagePlus className="h-3.5 w-3.5" /> Add Images
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
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-[#BF1A1A] hover:bg-red-50/40 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gray-100 group-hover:bg-[#BF1A1A]/10 transition-colors flex items-center justify-center mb-3">
                      <Upload className="h-6 w-6 text-gray-400 group-hover:text-[#BF1A1A] transition-colors" />
                    </div>
                    <span className="text-sm font-bold text-gray-500 group-hover:text-gray-700 mb-1">
                      Click to upload images
                    </span>
                    <span className="text-xs text-gray-400">
                      PNG, JPG, WEBP · max 10MB each · up to 10 images
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square">
                          <img
                            src={img.preview}
                            alt={`Product ${idx + 1}`}
                            className={`w-full h-full object-cover rounded-xl border-2 transition-all ${idx === 0 ? "border-[#BF1A1A]" : "border-transparent"}`}
                          />
                          {idx === 0 && (
                            <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-[#BF1A1A] text-white text-[10px] font-black rounded-md">
                              Cover
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveImage(idx, "left")}
                              disabled={idx === 0}
                              className="p-1 bg-white rounded-md disabled:opacity-30 hover:bg-gray-100 transition-colors"
                            >
                              <ChevronLeft className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveImage(idx, "right")}
                              disabled={idx === images.length - 1}
                              className="p-1 bg-white rounded-md disabled:opacity-30 hover:bg-gray-100 transition-colors"
                            >
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {images.length < 10 && (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#BF1A1A] hover:bg-red-50/40 transition-all"
                        >
                          <Plus className="h-5 w-5 text-gray-400" />
                          <span className="text-[10px] text-gray-400 mt-1 font-semibold">
                            Add more
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Hover over an image to reorder or remove it.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ─── DESCRIPTION ─── */}
          {currentTab === "description" && (
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Add Content Block
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      type: "paragraph",
                      icon: <AlignLeft className="h-3.5 w-3.5" />,
                      label: "Paragraph",
                    },
                    {
                      type: "heading",
                      icon: <Type className="h-3.5 w-3.5" />,
                      label: "Heading",
                    },
                    {
                      type: "bullet-list",
                      icon: <List className="h-3.5 w-3.5" />,
                      label: "Bullet List",
                    },
                    {
                      type: "ordered-list",
                      icon: <ListOrdered className="h-3.5 w-3.5" />,
                      label: "Numbered List",
                    },
                  ].map(({ type, icon, label }) => (
                    <button
                      key={type}
                      onClick={() => addDescriptionBlock(type)}
                      className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 rounded-lg hover:border-[#BF1A1A] hover:text-[#BF1A1A] transition-all text-sm font-semibold text-gray-700"
                    >
                      {icon} {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {descriptionBlocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-md text-xs font-bold text-gray-600 capitalize">
                        {block.type.replace("-", " ")}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveBlock(index, "up")}
                          disabled={index === 0}
                          className="p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-colors"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveBlock(index, "down")}
                          disabled={index === descriptionBlocks.length - 1}
                          className="p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-colors"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removeDescriptionBlock(block.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors ml-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {block.type === "paragraph" && (
                      <textarea
                        value={block.content}
                        rows="4"
                        placeholder="Write your paragraph..."
                        onChange={(e) =>
                          updateDescriptionBlock(block.id, e.target.value)
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] resize-none transition-all"
                      />
                    )}
                    {block.type === "heading" && (
                      <input
                        type="text"
                        value={block.content}
                        placeholder="Heading text..."
                        onChange={(e) =>
                          updateDescriptionBlock(block.id, e.target.value)
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] transition-all"
                      />
                    )}
                    {(block.type === "bullet-list" ||
                      block.type === "ordered-list") && (
                      <div className="space-y-2">
                        {block.content.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className="flex items-center gap-2"
                          >
                            <span className="text-gray-400 text-sm font-bold w-5 text-center flex-shrink-0">
                              {block.type === "ordered-list"
                                ? `${itemIdx + 1}.`
                                : "•"}
                            </span>
                            <input
                              type="text"
                              value={item}
                              placeholder="List item..."
                              onChange={(e) =>
                                updateListItem(
                                  block.id,
                                  itemIdx,
                                  e.target.value,
                                )
                              }
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] transition-all"
                            />
                            {block.content.length > 1 && (
                              <button
                                onClick={() =>
                                  removeListItem(block.id, itemIdx)
                                }
                                className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => addListItem(block.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-600 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Item
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {descriptionBlocks.length === 0 && (
                  <div className="text-center py-14 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <AlignLeft className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 font-semibold">
                      No content blocks yet
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Add some using the buttons above
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── FEATURES & SPECS ─── */}
          {currentTab === "details" && (
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-black text-gray-900">
                      Key Features
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Bullet points highlighting product strengths
                    </p>
                  </div>
                  <button
                    onClick={addFeature}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#BF1A1A] text-white rounded-lg hover:bg-[#8B1414] transition-colors text-xs font-bold"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Feature
                  </button>
                </div>
                <div className="space-y-2.5">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <input
                        type="text"
                        value={feature}
                        placeholder="e.g., 100% natural ingredients"
                        onChange={(e) => updateFeature(i, e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] transition-all"
                      />
                      <button
                        onClick={() => removeFeature(i)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {features.length === 0 && (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <p className="text-sm text-gray-400 font-semibold">
                        No features added yet
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-black text-gray-900">
                      Specifications
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Technical details like weight, volume, etc.
                    </p>
                  </div>
                  <button
                    onClick={addSpecification}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#BF1A1A] text-white rounded-lg hover:bg-[#8B1414] transition-colors text-xs font-bold"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Spec
                  </button>
                </div>
                <div className="space-y-2.5">
                  {specifications.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <input
                        type="text"
                        value={spec.key}
                        placeholder="Property (e.g., Weight)"
                        onChange={(e) =>
                          updateSpecification(i, "key", e.target.value)
                        }
                        className="w-2/5 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] transition-all"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        placeholder="Value (e.g., 500g)"
                        onChange={(e) =>
                          updateSpecification(i, "value", e.target.value)
                        }
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] transition-all"
                      />
                      <button
                        onClick={() => removeSpecification(i)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {specifications.length === 0 && (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <p className="text-sm text-gray-400 font-semibold">
                        No specifications added yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 bg-gray-50/60">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40"
          >
            <X className="h-4 w-4" /> Cancel
          </button>

          <div className="flex items-center gap-3">
            {currentTab !== "details" && (
              <button
                onClick={() => {
                  const tabs = ["basic", "description", "details"];
                  setCurrentTab(tabs[tabs.indexOf(currentTab) + 1]);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#BF1A1A] text-white rounded-xl text-sm font-black hover:bg-[#8B1414] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}

// ============================================================================
// STAR RATING DISPLAY
// ============================================================================
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3 w-3 ${s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  );
}

// ============================================================================
// PRODUCT CARD
// ============================================================================
function ProductCard({ product, onEdit, onDelete, onView }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const imageList = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const imageUrl =
    imageList[activeIndex]?.url ||
    "https://via.placeholder.com/300x300?text=No+Image";
  const moq = product.minimumOrderQuantity || 1;
  const packPrice = product.totalPrice ?? product.price * moq;
  const unitPrice = product.price;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col group"
    >
      {/* Image area */}
      <div
        className="relative overflow-hidden bg-gray-50"
        style={{ aspectRatio: "4/3" }}
      >
        <img
          src={imageUrl}
          alt={product.title}
          className={`w-full h-full object-contain p-4 transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
          }}
        />

        {/* Overlays */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide ${BADGE_STYLES[product.badge] || "bg-gray-700 text-white"}`}
            >
              {product.badge}
            </span>
          )}
          {product.isHalal && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-500 text-white">
              HALAL ✓
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          {moq > 1 && (
            <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md">
              <span className="font-black text-[10px]">×{moq}</span>
            </div>
          )}
          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
              product.inStock
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-red-50 text-red-700 border border-red-100"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Image navigation */}
        {imageList.length > 1 && (
          <>
            <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5">
              {imageList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === activeIndex ? "w-5 bg-[#BF1A1A]" : "w-1.5 bg-white/70"}`}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              disabled={activeIndex === 0}
              className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow transition-opacity disabled:opacity-0 ${hovered ? "opacity-100" : "opacity-0"}`}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() =>
                setActiveIndex((i) => Math.min(imageList.length - 1, i + 1))
              }
              disabled={activeIndex === imageList.length - 1}
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow transition-opacity disabled:opacity-0 ${hovered ? "opacity-100" : "opacity-0"}`}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <div>
          <p className="text-[10px] font-bold text-[#BF1A1A] uppercase tracking-widest mb-0.5">
            {product.category}
          </p>
          <h3 className="font-black text-gray-900 text-sm leading-snug line-clamp-2">
            {product.title}
          </h3>
        </div>

        {(product.rating > 0 || product.reviews > 0) && (
          <div className="flex items-center gap-2">
            <StarRating rating={product.rating} />
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
        )}

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-gray-900">
              KSh {packPrice.toFixed(2)}
            </span>
            {moq > 1 && (
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                pack of {moq}
              </span>
            )}
          </div>
          {moq > 1 && (
            <p className="text-xs text-emerald-600 font-semibold">
              KSh {unitPrice.toFixed(2)} per piece
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-1 border-t border-gray-50">
          <span>
            Stock:{" "}
            <span
              className={`font-bold ${product.stock < 10 ? "text-red-500" : "text-gray-600"}`}
            >
              {product.stock}
            </span>
          </span>
          {product.stock < 10 && product.stock > 0 && (
            <span className="text-red-500 font-semibold">Low stock</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className={`flex gap-2 px-4 pb-4 transition-all duration-300 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
      >
        <button
          onClick={() => onEdit(product)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#BF1A1A] text-white rounded-xl hover:bg-[#8B1414] transition-colors text-xs font-bold"
        >
          <Edit2 className="h-3.5 w-3.5" /> Edit
        </button>
        <button
          onClick={() => onView(product)}
          className="w-9 h-9 flex items-center justify-center bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors flex-shrink-0"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors flex-shrink-0"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// STAT CARD
// ============================================================================
function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:border-gray-200 hover:shadow-md transition-all duration-300">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-semibold">{label}</p>
        <p className="text-2xl font-black text-gray-900 leading-none mt-0.5">
          {value}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function DashboardProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.inStock).length,
    outOfStock: products.filter((p) => !p.inStock).length,
    lowStock: products.filter((p) => p.inStock && p.stock < 10).length,
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page: 1, limit: 100 };
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory && selectedCategory !== "all")
        params.category = selectedCategory;
      const response = await productService.getAllProducts(params);
      if (response.success) setProducts(response.data);
      else throw new Error(response.message || "Failed to fetch products");
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const response = await productService.deleteProduct(id);
      if (response.success) {
        setProducts(products.filter((p) => p._id !== id));
      } else throw new Error(response.message || "Failed to delete product");
    } catch (err) {
      alert(err.message || "Failed to delete product");
    }
  };

  const handleSaveProduct = async (productData) => {
    if (editingProduct) {
      const response = await productService.updateProduct(
        editingProduct._id,
        productData,
      );
      if (response.success)
        setProducts(
          products.map((p) =>
            p._id === editingProduct._id ? response.data : p,
          ),
        );
      else throw new Error(response.message || "Failed to update product");
    } else {
      const response = await productService.createProduct(productData);
      if (response.success) setProducts([response.data, ...products]);
      else throw new Error(response.message || "Failed to create product");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };
  const hasActiveFilters = searchQuery || selectedCategory !== "all";

  return (
    <div className="space-y-6 min-h-screen">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#BF1A1A]/10 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-[#BF1A1A]" />
            </div>
            <h1
              className="text-3xl font-black text-gray-900 tracking-tight"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: "0.02em",
              }}
            >
              Products
            </h1>
          </div>
          <p className="text-sm text-gray-400 font-medium">
            {loading
              ? "Loading inventory..."
              : `${stats.total} products · ${stats.inStock} in stock`}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#BF1A1A] text-white rounded-xl font-bold text-sm hover:bg-[#8B1414] transition-all duration-300 shadow-sm hover:shadow-md flex-shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* ─── STATS ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.total}
          color="bg-[#BF1A1A]"
        />
        <StatCard
          icon={CheckCircle2}
          label="In Stock"
          value={stats.inStock}
          color="bg-emerald-500"
          sub={`${stats.total > 0 ? Math.round((stats.inStock / stats.total) * 100) : 0}% of inventory`}
        />
        <StatCard
          icon={XCircle}
          label="Out of Stock"
          value={stats.outOfStock}
          color="bg-red-400"
        />
        <StatCard
          icon={TrendingUp}
          label="Low Stock"
          value={stats.lowStock}
          color="bg-amber-500"
          sub="< 10 units"
        />
      </div>

      {/* ─── SEARCH + FILTERS ─── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] focus:bg-white transition-all placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center hover:bg-gray-400 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-bold transition-all ${
                showFilters || selectedCategory !== "all"
                  ? "bg-[#BF1A1A]/10 border-[#BF1A1A]/30 text-[#BF1A1A]"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
              {selectedCategory !== "all" && (
                <span className="w-5 h-5 rounded-full bg-[#BF1A1A] text-white text-[10px] font-black flex items-center justify-center">
                  1
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}

            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Category pills — collapsible */}
        {showFilters && (
          <div className="px-4 pb-4 border-t border-gray-50 pt-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
              Filter by Category
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === "all"
                    ? "bg-[#BF1A1A] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All Products
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-[#BF1A1A] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active filter indicator */}
        {selectedCategory !== "all" && !showFilters && (
          <div className="px-4 pb-3 flex items-center gap-2">
            <Tag className="h-3.5 w-3.5 text-[#BF1A1A]" />
            <span className="text-xs text-gray-500">
              Filtering by:{" "}
              <span className="font-bold text-gray-800">
                {selectedCategory}
              </span>
            </span>
            <button
              onClick={() => setSelectedCategory("all")}
              className="ml-1 text-[#BF1A1A] hover:text-[#8B1414]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ─── LOADING ─── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
            <div className="absolute inset-0 rounded-full border-4 border-[#BF1A1A] border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-gray-400 font-medium">
            Loading products...
          </p>
        </div>
      )}

      {/* ─── ERROR ─── */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-red-900 text-sm">
                Failed to load products
              </h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors flex-shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        </div>
      )}

      {/* ─── PRODUCT GRID ─── */}
      {!loading &&
        !error &&
        (products.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 font-semibold">
                {products.length} product{products.length !== 1 ? "s" : ""}{" "}
                found
                {hasActiveFilters && " · filtered results"}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEdit={(p) => {
                    setEditingProduct(p);
                    setIsFormOpen(true);
                  }}
                  onDelete={handleDeleteProduct}
                  onView={(p) => console.log("View:", p)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Package className="h-7 w-7 text-gray-300" />
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-1">
              {hasActiveFilters ? "No results found" : "No products yet"}
            </h3>
            <p className="text-sm text-gray-400 text-center max-w-xs">
              {hasActiveFilters
                ? "Try adjusting your search or clearing the filters to see more products."
                : "Get started by adding your first product to the inventory."}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4" /> Clear Filters
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsFormOpen(true);
                }}
                className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-[#BF1A1A] text-white rounded-xl font-bold text-sm hover:bg-[#8B1414] transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Your First Product
              </button>
            )}
          </div>
        ))}

      {/* ─── MODAL ─── */}
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
