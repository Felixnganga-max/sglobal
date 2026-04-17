import React, { useState, useEffect, useRef } from "react";
import {
  Package,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Upload,
  ImagePlus,
  Plus,
  Trash2,
  Save,
  Loader2,
  AlignLeft,
  Type,
  List,
  ListOrdered,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { productService } from "../api/productService";

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
  "Water",
];

const BADGES = ["SPECIAL OFFER", "HOT DEALS", "LIMITED OFFER"];

function ProductFormModal({ isOpen, onClose, editProduct, onSave }) {
  const [currentTab, setCurrentTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingImages, setDeletingImages] = useState({});
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
              publicId: img.publicId,
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

  // FIXED: delete calls productService.deleteProductImages which now uses axios
  const handleDeleteImage = async (index) => {
    const imageToDelete = images[index];

    if (imageToDelete.isExisting && imageToDelete.publicId) {
      if (
        !window.confirm(
          "Delete this image permanently? This action cannot be undone.",
        )
      ) {
        return;
      }

      setDeletingImages((prev) => ({ ...prev, [index]: true }));

      try {
        await productService.deleteProductImages(editProduct._id, [
          imageToDelete.publicId,
        ]);
        setImages((prev) => prev.filter((_, idx) => idx !== index));
      } catch (error) {
        console.error("Failed to delete image:", error);
        alert(error.message || "Failed to delete image. Please try again.");
      } finally {
        setDeletingImages((prev) => {
          const newState = { ...prev };
          delete newState[index];
          return newState;
        });
      }
    } else {
      if (window.confirm("Remove this image?")) {
        setImages((prev) => prev.filter((_, idx) => idx !== index));
      }
    }
  };

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
          {
            preview: reader.result,
            base64: reader.result,
            isExisting: false,
            publicId: null,
          },
        ]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const moveImage = (i, dir) => {
    setImages((prev) => {
      const next = [...prev];
      const t = dir === "left" ? i - 1 : i + 1;
      if (t < 0 || t >= next.length) return prev;
      [next[i], next[t]] = [next[t], next[i]];
      return next;
    });
  };

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
          {/* BASIC INFO TAB */}
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

              {/* ── IMAGE UPLOAD — FIXED ── */}
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
                    {/*
                      FIXED: Each image card has an always-visible action strip below
                      the image thumbnail. No hover, no opacity tricks — buttons are
                      always rendered so they work on touch screens too.
                    */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {images.map((img, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          {/* Thumbnail */}
                          <div className="relative aspect-square">
                            <img
                              src={img.preview}
                              alt={`Product ${idx + 1}`}
                              className={`w-full h-full object-cover rounded-xl border-2 transition-all ${
                                idx === 0
                                  ? "border-[#BF1A1A]"
                                  : "border-transparent border border-gray-100"
                              }`}
                            />
                            {idx === 0 && (
                              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#BF1A1A] text-white text-[10px] font-black rounded-md leading-tight">
                                Cover
                              </span>
                            )}
                            {/* Loading spinner overlay while deleting */}
                            {deletingImages[idx] && (
                              <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center">
                                <Loader2 className="h-5 w-5 text-[#BF1A1A] animate-spin" />
                              </div>
                            )}
                          </div>

                          {/* Always-visible action strip */}
                          <div className="flex items-center justify-between gap-1 px-0.5">
                            {/* Move left */}
                            <button
                              type="button"
                              onClick={() => moveImage(idx, "left")}
                              disabled={idx === 0 || !!deletingImages[idx]}
                              title="Move left"
                              className="flex-1 flex items-center justify-center py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <ChevronLeft className="h-3.5 w-3.5 text-gray-600" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(idx)}
                              disabled={!!deletingImages[idx]}
                              title="Delete image"
                              className="flex-1 flex items-center justify-center py-1.5 rounded-lg bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-500" />
                            </button>

                            {/* Move right */}
                            <button
                              type="button"
                              onClick={() => moveImage(idx, "right")}
                              disabled={
                                idx === images.length - 1 ||
                                !!deletingImages[idx]
                              }
                              title="Move right"
                              className="flex-1 flex items-center justify-center py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add more slot */}
                      {images.length < 10 && (
                        <div className="flex flex-col gap-1">
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#BF1A1A] hover:bg-red-50/40 transition-all"
                          >
                            <Plus className="h-5 w-5 text-gray-400" />
                            <span className="text-[10px] text-gray-400 mt-1 font-semibold">
                              Add more
                            </span>
                          </div>
                          {/* Spacer so the add-more card aligns with image cards */}
                          <div className="h-[30px]" />
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 mt-2.5">
                      Use the arrows to reorder · trash icon to delete
                      {editProduct &&
                        " · existing images are removed from the server immediately"}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* DESCRIPTION TAB */}
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
                          className="p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-30"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveBlock(index, "down")}
                          disabled={index === descriptionBlocks.length - 1}
                          className="p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-30"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removeDescriptionBlock(block.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 ml-1"
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
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A] resize-none"
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
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A]"
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
                            <span className="text-gray-400 text-sm font-bold w-5 text-center">
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
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A]"
                            />
                            {block.content.length > 1 && (
                              <button
                                onClick={() =>
                                  removeListItem(block.id, itemIdx)
                                }
                                className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => addListItem(block.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-600"
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

          {/* FEATURES & SPECS TAB */}
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
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#BF1A1A] text-white rounded-lg hover:bg-[#8B1414] text-xs font-bold"
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
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A]"
                      />
                      <button
                        onClick={() => removeFeature(i)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-400"
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
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#BF1A1A] text-white rounded-lg hover:bg-[#8B1414] text-xs font-bold"
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
                        className="w-2/5 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A]"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        placeholder="Value (e.g., 500g)"
                        onChange={(e) =>
                          updateSpecification(i, "value", e.target.value)
                        }
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/30 focus:border-[#BF1A1A]"
                      />
                      <button
                        onClick={() => removeSpecification(i)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-400"
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

export default ProductFormModal;
