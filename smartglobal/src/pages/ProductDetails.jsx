import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Star,
  Minus,
  Plus,
  ArrowLeft,
  Package,
  Truck,
  Shield,
  Share2,
} from "lucide-react";

const API_URL = "http://localhost:3000/smartglobal/products";

/**
 * ProductDetails Component
 * Complete product page with:
 * - Image gallery
 * - Product info
 * - Add to cart
 * - Related products
 * Colors: Red (#BF1A1A), Yellow (#FFD41D), Brown (#7B4019)
 */

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    if (product?.category) {
      fetchRelatedProducts();
    }
  }, [product]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/${id}`);

      if (!response.ok) {
        throw new Error("Product not found");
      }

      const data = await response.json();

      // Handle different response formats
      const productData = data.success ? data.data : data;
      setProduct(productData);
      setError(null);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/category/${product.category}`);

      if (response.ok) {
        const data = await response.json();
        const products = data.success ? data.data : data;

        // Filter out current product and limit to 4
        const filtered = products
          .filter((p) => (p._id || p.id) !== (product._id || product.id))
          .slice(0, 4);

        setRelatedProducts(filtered);
      }
    } catch (err) {
      console.error("Error fetching related products:", err);
    }
  };

  const handleQuantityChange = (type) => {
    if (type === "increment" && quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", { product, quantity });
    // TODO: Integrate with cart context/state
    alert(`Added ${quantity} ${product.name} to cart!`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Info Skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
            <p className="text-red-600 font-bold text-xl mb-2">
              Product Not Found
            </p>
            <p className="text-gray-600 mb-6">
              {error || "This product doesn't exist"}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-[#BF1A1A] text-white font-bold rounded-lg hover:bg-[#8B1414] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get product images (support multiple formats)
  const getProductImages = () => {
    if (product.images && Array.isArray(product.images)) {
      return product.images;
    }
    // Check various possible image field names
    const imageUrl =
      product.image || product.imageUrl || product.img || product.photo;
    return imageUrl ? [imageUrl] : [];
  };

  const images = getProductImages();
  const currentImage =
    images[selectedImage] ||
    images[0] ||
    "https://via.placeholder.com/600?text=No+Image";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-[#BF1A1A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">
              {product.category || "Products"}
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold truncate">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border-2 border-gray-200 group">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600?text=No+Image";
                }}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.discount && (
                  <span className="px-3 py-1 bg-[#BF1A1A] text-white text-sm font-bold rounded">
                    {product.discount}% OFF
                  </span>
                )}
                {product.onSale && (
                  <span className="px-3 py-1 bg-[#FFD41D] text-black text-sm font-bold rounded">
                    SALE
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="px-3 py-1 bg-gray-900 text-white text-sm font-bold rounded">
                    OUT OF STOCK
                  </span>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isWishlisted
                    ? "bg-red-50 scale-110"
                    : "bg-white opacity-0 group-hover:opacity-100"
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${
                    isWishlisted
                      ? "fill-[#BF1A1A] text-[#BF1A1A]"
                      : "text-gray-400"
                  }`}
                />
              </button>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-[#BF1A1A] ring-2 ring-[#BF1A1A]/30"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/150?text=No+Image";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {product.category && (
              <div>
                <span className="inline-block px-3 py-1 bg-[#7B4019]/10 text-[#7B4019] text-xs font-bold uppercase tracking-wide rounded">
                  {product.category}
                </span>
              </div>
            )}

            {/* Product Name */}
            <h1
              className="text-3xl lg:text-4xl font-black text-gray-900"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            {(product.rating || product.reviews) && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0)
                          ? "fill-[#FFD41D] text-[#FFD41D]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating?.toFixed(1)} (
                  {product.reviews || product.reviewCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-[#BF1A1A]">
                KSh {(product.price * quantity).toLocaleString()}
              </span>
              {product.oldPrice && (
                <span className="text-xl text-gray-400 line-through">
                  KSh {(product.oldPrice * quantity).toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock Status */}
            <div className="p-4 bg-gray-50 rounded-xl">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-600">
                    In Stock ({product.stock} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-semibold text-red-600">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange("decrement")}
                      disabled={quantity <= 1}
                      className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-3 font-bold text-lg min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange("increment")}
                      disabled={quantity >= product.stock}
                      className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stock} available
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-lg transition-all ${
                  product.stock === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#BF1A1A] to-[#8B1414] text-white hover:shadow-2xl hover:scale-105"
                }`}
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
              </button>

              <button
                onClick={handleShare}
                className="px-6 py-4 border-2 border-gray-200 rounded-xl hover:border-[#BF1A1A] hover:bg-red-50 transition-all"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FFD41D]/20 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-[#7B4019]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">
                    Free Delivery
                  </h4>
                  <p className="text-xs text-gray-600">Orders over KSh 5,000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FFD41D]/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-[#7B4019]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">
                    Quality Assured
                  </h4>
                  <p className="text-xs text-gray-600">Premium products</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FFD41D]/20 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-[#7B4019]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">
                    Easy Returns
                  </h4>
                  <p className="text-xs text-gray-600">7-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2
                className="text-3xl font-black text-gray-900"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                RELATED PRODUCTS
              </h2>
              <button
                onClick={() =>
                  navigate(`/products?category=${product.category}`)
                }
                className="text-sm font-bold text-[#BF1A1A] hover:text-[#8B1414] transition-colors"
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <RelatedProductCard
                  key={relatedProduct._id || relatedProduct.id}
                  product={relatedProduct}
                  onClick={() =>
                    navigate(
                      `/product/${relatedProduct._id || relatedProduct.id}`,
                    )
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap");
      `}</style>
    </div>
  );
}

/**
 * Related Product Card Component
 */
function RelatedProductCard({ product, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 border-2 border-gray-200 hover:border-[#FFD41D] hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative aspect-square bg-[#FFF8E7] rounded-xl mb-4 overflow-hidden">
        <img
          src={product.image || product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300?text=No+Image";
          }}
        />
      </div>

      <h3 className="text-sm font-bold text-black mb-2 line-clamp-2 min-h-[40px]">
        {product.name}
      </h3>

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-[#BF1A1A]">
          KSh {product.price?.toLocaleString()}
        </span>
        {product.oldPrice && (
          <span className="text-xs text-gray-400 line-through">
            KSh {product.oldPrice.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}
