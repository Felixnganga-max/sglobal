import React from "react";

/**
 * FeaturedProductsGrid.jsx
 * Grid layout for product cards
 * Colors: Red (#BF1A1A), Yellow (#FFD41D), Black, White, Brown (#7B4019)
 * Responsive: 1 column mobile, 2 columns tablet, 4 columns desktop
 */

export default function FeaturedProductsGrid({ products = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

/**
 * ProductCard Component
 * Individual product card with image, title, price, rating
 */
function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-gray-200 hover:border-[#FFD41D] hover:shadow-xl transition-all duration-300 group cursor-pointer">
      {/* Product Image */}
      <div className="relative aspect-square bg-[#FFF8E7] rounded-xl mb-4 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-[#BF1A1A] text-white text-xs font-bold rounded">
            {product.discount} OFF
          </span>
        )}

        {/* Sale Badge */}
        {product.sale && (
          <span className="absolute top-2 right-2 px-2 py-1 bg-[#FFD41D] text-black text-xs font-bold rounded">
            SALE
          </span>
        )}

        {/* Wishlist Heart */}
        <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#BF1A1A]">
          <img
            src="https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=50&q=80"
            alt="Wishlist"
            className="w-4 h-4 rounded-full object-cover"
          />
        </button>
      </div>

      {/* Product Info */}
      <div>
        {/* Category */}
        <div className="text-xs text-[#7B4019] mb-1 uppercase tracking-wide">
          {product.category}
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-bold text-black mb-2 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-sm ${i < product.rating ? "text-[#FFD41D]" : "text-gray-300"}`}
            >
              ★
            </span>
          ))}
          <span className="text-xs text-gray-400 ml-1">
            ({product.reviews || 0})
          </span>
        </div>

        {/* Price and Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#BF1A1A]">
                ${product.price}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ${product.oldPrice}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button className="px-4 py-2 bg-[#FFD41D] text-black font-bold rounded-full hover:bg-[#BF1A1A] hover:text-white transition-colors shadow-md">
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
                Out of Stock
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
