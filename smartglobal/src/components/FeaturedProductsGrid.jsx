import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart } from "lucide-react";

const API_URL = "http://localhost:3000/smartglobal/products";

/**
 * FeaturedProductsGrid.jsx
 * Grid layout for product cards with API integration
 * Colors: Red (#BF1A1A), Yellow (#FFD41D), Black, White, Brown (#7B4019)
 * Responsive: 1 column mobile, 2 columns tablet, 4 columns desktop
 */

export default function FeaturedProductsGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      // Handle different response formats
      if (data.success) {
        setProducts(data.data || []);
      } else {
        setProducts(data);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <p className="text-red-600 font-semibold mb-2">
            Unable to load products
          </p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-6 py-2 bg-[#BF1A1A] text-white font-bold rounded-lg hover:bg-[#8B1414] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 max-w-md mx-auto">
          <p className="text-gray-600 font-semibold mb-2">
            No products available
          </p>
          <p className="text-sm text-gray-500">
            Check back soon for new products!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id || product.id} product={product} />
      ))}
    </div>
  );
}

/**
 * ProductCard Component
 * Individual product card with image, title, price, rating
 */
function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    console.log("Added to cart:", product);
    // TODO: Integrate with your cart context/state management
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Save to wishlist in backend
  };

  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-gray-200 hover:border-[#FFD41D] hover:shadow-xl transition-all duration-300 group cursor-pointer">
      {/* Product Image */}
      <div className="relative aspect-square bg-[#FFF8E7] rounded-xl mb-4 overflow-hidden">
        <img
          src={product.image || product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300?text=No+Image";
          }}
        />

        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-[#BF1A1A] text-white text-xs font-bold rounded">
            {product.discount}% OFF
          </span>
        )}

        {/* Sale Badge */}
        {product.onSale && (
          <span className="absolute top-2 right-2 px-2 py-1 bg-[#FFD41D] text-black text-xs font-bold rounded">
            SALE
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-2 ${product.discount ? "right-2" : product.onSale ? "left-2" : "right-2"} w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 ${
            isWishlisted ? "opacity-100 bg-red-50" : ""
          }`}
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? "fill-[#BF1A1A] text-[#BF1A1A]" : "text-gray-400"}`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div>
        {/* Category */}
        {product.category && (
          <div className="text-xs text-[#7B4019] mb-1 uppercase tracking-wide font-semibold">
            {product.category}
          </div>
        )}

        {/* Product Name */}
        <h3 className="text-sm font-bold text-black mb-2 line-clamp-2 min-h-[40px]">
          {product.name || product.title}
        </h3>

        {/* Rating */}
        {(product.rating || product.reviews || product.reviewCount) && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${i < Math.floor(product.rating || 0) ? "text-[#FFD41D]" : "text-gray-300"}`}
              >
                ★
              </span>
            ))}
            <span className="text-xs text-gray-400 ml-1">
              ({product.reviews || product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Price and Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#BF1A1A]">
                KSh {product.price?.toLocaleString()}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-gray-400 line-through">
                  KSh {product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-4 py-2 font-bold rounded-full transition-all shadow-md flex items-center gap-1 ${
              product.stock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#FFD41D] text-black hover:bg-[#BF1A1A] hover:text-white hover:scale-105"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            {product.stock > 0 ? (
              <span className="text-xs text-green-600 font-medium">
                ✓ In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-xs text-[#BF1A1A] font-medium">
                ✗ Out of Stock
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Loading Skeleton Component
 */
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-gray-200 animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>

      {/* Category Skeleton */}
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>

      {/* Title Skeleton */}
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>

      {/* Rating Skeleton */}
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>

      {/* Price Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded-full w-16"></div>
      </div>
    </div>
  );
}
