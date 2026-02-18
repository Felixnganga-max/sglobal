import React, { useState, useEffect } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { productService } from "../api/productService";

// ============================================================================
// PRODUCT FORM MODAL COMPONENT
// ============================================================================
function ProductFormModal({ isOpen, onClose, editProduct, onSave }) {
  const [currentTab, setCurrentTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      imageData: null, // Base64 image data
      imagePreview: null,
      shortDescription: "",
    },
  );

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
        imageData: null,
        imagePreview: editProduct.image?.url || null,
        shortDescription: editProduct.shortDescription,
      });
      setDescriptionBlocks(editProduct.descriptionBlocks || []);
      setFeatures(editProduct.features || []);
      setSpecifications(editProduct.specifications || []);
    }
  }, [editProduct]);

  const categories = [
    "Craft cooked potato chips",
    "Just fruits",
    "Hum Hum",
    "Cakemix",
    "Brownie & Pancake",
    "Whipped creams",
    "Boringer topping sauces",
    "Kent stocks",
    "Kent sauces",
    "Kent spreads",
    "Kizembe spring water",
  ];

  const badges = ["NEW", "SALE", "HOT", "LIMITED"];

  // Image upload handler - Convert to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size should be less than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageData: reader.result, // Base64 string with data:image prefix
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Description block management
  const addDescriptionBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type: type,
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

  // List item management
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

  // Features management
  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const updateFeature = (index, value) => {
    setFeatures(features.map((f, i) => (i === index ? value : f)));
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Specifications management
  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const updateSpecification = (index, field, value) => {
    setSpecifications(
      specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec,
      ),
    );
  };

  const removeSpecification = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  // Calculate discount
  const calculateDiscount = () => {
    if (formData.price && formData.oldPrice) {
      const discount = Math.round(
        ((parseFloat(formData.oldPrice) - parseFloat(formData.price)) /
          parseFloat(formData.oldPrice)) *
          100,
      );
      return discount > 0 ? discount : null;
    }
    return null;
  };

  // Form validation
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
    if (!editProduct && !formData.imageData) {
      alert("Please upload a product image");
      return false;
    }
    return true;
  };

  // Form submission
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
          id: index, // Renumber IDs sequentially
        })),
        features: features.filter((f) => f.trim() !== ""),
        specifications: specifications.filter(
          (s) => s.key.trim() !== "" && s.value.trim() !== "",
        ),
      };

      // Only include imageData if a new image was uploaded
      if (formData.imageData) {
        productData.imageData = formData.imageData;
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
          <button
            onClick={() => setCurrentTab("basic")}
            className={`px-6 py-3 font-bold text-sm transition-all ${
              currentTab === "basic"
                ? "border-b-2 border-[#BF1A1A] text-[#BF1A1A]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setCurrentTab("description")}
            className={`px-6 py-3 font-bold text-sm transition-all ${
              currentTab === "description"
                ? "border-b-2 border-[#BF1A1A] text-[#BF1A1A]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setCurrentTab("details")}
            className={`px-6 py-3 font-bold text-sm transition-all ${
              currentTab === "details"
                ? "border-b-2 border-[#BF1A1A] text-[#BF1A1A]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Features & Specs
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* BASIC INFO TAB */}
          {currentTab === "basic" && (
            <div className="space-y-6">
              {/* Product Title */}
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
                    {badges.map((badge) => (
                      <option key={badge} value={badge}>
                        {badge}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Old Price */}
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
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="0.00"
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
                      onChange={(e) =>
                        setFormData({ ...formData, oldPrice: e.target.value })
                      }
                      placeholder="0.00"
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
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Discount Display */}
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
                    onChange={(e) =>
                      setFormData({ ...formData, reviews: e.target.value })
                    }
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Halal Certification */}
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value,
                    })
                  }
                  rows="3"
                  placeholder="Brief product description (appears on product card)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Product Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-[#BF1A1A] transition-colors">
                  {formData.imagePreview ? (
                    <div className="relative">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg object-contain"
                      />
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            imageData: null,
                            imagePreview: null,
                          })
                        }
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mb-3" />
                      <span className="text-sm font-bold text-gray-600 mb-1">
                        Click to upload image
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG up to 10MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* DESCRIPTION TAB */}
          {currentTab === "description" && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-600 font-semibold mb-3">
                  Add Rich Content Blocks
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => addDescriptionBlock("paragraph")}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <AlignLeft className="h-4 w-4" />
                    <span className="text-sm font-bold">Paragraph</span>
                  </button>
                  <button
                    onClick={() => addDescriptionBlock("heading")}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Type className="h-4 w-4" />
                    <span className="text-sm font-bold">Heading</span>
                  </button>
                  <button
                    onClick={() => addDescriptionBlock("bullet-list")}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <List className="h-4 w-4" />
                    <span className="text-sm font-bold">Bullet List</span>
                  </button>
                  <button
                    onClick={() => addDescriptionBlock("ordered-list")}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ListOrdered className="h-4 w-4" />
                    <span className="text-sm font-bold">Numbered List</span>
                  </button>
                </div>
              </div>

              {/* Description Blocks */}
              <div className="space-y-4">
                {descriptionBlocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 relative group"
                  >
                    {/* Block Controls */}
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

                    {/* Block Content */}
                    {block.type === "paragraph" && (
                      <textarea
                        value={block.content}
                        onChange={(e) =>
                          updateDescriptionBlock(block.id, e.target.value)
                        }
                        rows="4"
                        placeholder="Write your paragraph here..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] resize-none"
                      />
                    )}

                    {block.type === "heading" && (
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) =>
                          updateDescriptionBlock(block.id, e.target.value)
                        }
                        placeholder="Enter heading..."
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
                              onChange={(e) =>
                                updateListItem(
                                  block.id,
                                  itemIndex,
                                  e.target.value,
                                )
                              }
                              placeholder="List item..."
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
                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-bold"
                        >
                          <Plus className="h-4 w-4" />
                          Add Item
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

          {/* FEATURES & SPECS TAB */}
          {currentTab === "details" && (
            <div className="space-y-6">
              {/* Features Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Key Features
                  </h3>
                  <button
                    onClick={addFeature}
                    className="flex items-center gap-2 px-4 py-2 bg-[#BF1A1A] text-white rounded-lg hover:bg-[#8B1414] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Feature
                  </button>
                </div>

                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-[#BF1A1A] font-bold">✓</span>
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="e.g., 100% natural ingredients"
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

              {/* Specifications Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Specifications
                  </h3>
                  <button
                    onClick={addSpecification}
                    className="flex items-center gap-2 px-4 py-2 bg-[#BF1A1A] text-white rounded-lg hover:bg-[#8B1414] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Specification
                  </button>
                </div>

                <div className="space-y-3">
                  {specifications.map((spec, index) => (
                    <div key={index} className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) =>
                          updateSpecification(index, "key", e.target.value)
                        }
                        placeholder="e.g., Weight"
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                      />
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) =>
                            updateSpecification(index, "value", e.target.value)
                          }
                          placeholder="e.g., 500g"
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

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#BF1A1A] to-[#8B1414] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
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
// PRODUCT CARD COMPONENT (Dashboard View)
// ============================================================================
function ProductCard({ product, onEdit, onDelete, onView }) {
  // Use placeholder image if no image available
  const imageUrl =
    product.image?.url || "https://via.placeholder.com/300x300?text=No+Image";

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
        <div className="absolute top-2 right-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              product.inStock
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
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

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  // Fetch product statistics
  useEffect(() => {
    fetchStats();
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: 1,
        limit: 100, // Fetch all for dashboard
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

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
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = () => {
    const totalProducts = products.length;
    const inStockProducts = products.filter((p) => p.inStock).length;
    const outOfStockProducts = products.filter((p) => !p.inStock).length;

    setStats({
      totalProducts,
      inStockProducts,
      outOfStockProducts,
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
    // Navigate to product detail page or show modal
    console.log("View product:", product);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await productService.deleteProduct(id);

      if (response.success) {
        // Remove from local state
        setProducts(products.filter((p) => p._id !== id));
        alert("Product deleted successfully!");
      } else {
        throw new Error(response.message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err.message || "Failed to delete product");
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        // Update existing product
        const response = await productService.updateProduct(
          editingProduct._id,
          productData,
        );

        if (response.success) {
          // Update local state
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
        // Create new product
        const response = await productService.createProduct(productData);

        if (response.success) {
          // Add to local state
          setProducts([response.data, ...products]);
          alert("Product created successfully!");
        } else {
          throw new Error(response.message || "Failed to create product");
        }
      }
    } catch (err) {
      console.error("Error saving product:", err);
      throw err; // Re-throw to be handled by the modal
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
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
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

          {/* Category Filter */}
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
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#BF1A1A] flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">
                Total Products
              </p>
              <p
                className="text-2xl font-black text-gray-900"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {stats.totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">In Stock</p>
              <p
                className="text-2xl font-black text-gray-900"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {stats.inStockProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">
                Out of Stock
              </p>
              <p
                className="text-2xl font-black text-gray-900"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {stats.outOfStockProducts}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-12 w-12 text-[#BF1A1A] animate-spin" />
        </div>
      )}

      {/* Error State */}
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
      {!loading && !error && (
        <>
          {products.length > 0 ? (
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
            /* Empty State */
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
                  <Plus className="h-5 w-5" />
                  Add Your First Product
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Product Form Modal */}
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
