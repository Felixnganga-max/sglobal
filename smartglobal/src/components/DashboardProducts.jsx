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
import ProductFormModal from "./ProductFormModal";

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
  "Water",
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
<ProductFormModal />;
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
