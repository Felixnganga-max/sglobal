import React, { useState } from "react";
import { assets } from "../assets/assets";

/**
 * Premium Product Card Component
 * Designed for Kent Boringer e-commerce
 * Features: Image, title, description, price, Add to Cart, Buy Now
 */

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    // Add your cart logic here
    console.log(`Added ${quantity}x ${product.title} to cart`);
  };

  const handleBuyNow = () => {
    // Add your checkout logic here
    console.log(`Buy now: ${quantity}x ${product.title}`);
  };

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 hover:border-[#BF1A1A]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-20">
          <span
            className={`px-4 py-2 rounded-full text-xs font-black tracking-wider shadow-lg ${
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

      {/* Discount Badge */}
      {product.discount && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-red-600 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
            -{product.discount}%
          </div>
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className={`w-full h-full object-contain p-6 transition-all duration-700 ${
            isHovered ? "scale-110 rotate-3" : "scale-100 rotate-0"
          }`}
        />

        {/* Quick View Overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button className="px-6 py-3 bg-white text-gray-900 rounded-full font-bold text-sm hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        {/* Category */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#BF1A1A] uppercase tracking-wider">
            {product.category}
          </span>
          {product.isHalal && (
            <span className="text-xs bg-[#4CAF50] text-white px-2 py-1 rounded-full font-bold">
              Halal ✓
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-[#BF1A1A] transition-colors duration-300">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "text-[#FFD41D]"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600 font-semibold">
              {product.rating} ({product.reviews || 0})
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-end gap-3">
          <div className="text-3xl font-black text-[#BF1A1A]">
            ${product.price}
          </div>
          {product.oldPrice && (
            <div className="text-lg text-gray-400 line-through font-semibold pb-1">
              ${product.oldPrice}
            </div>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">Qty:</span>
          <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition-colors duration-200"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-16 text-center py-2 font-bold text-gray-900 focus:outline-none"
              min="1"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition-colors duration-200"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-xl ${
              addedToCart
                ? "bg-[#4CAF50] text-white"
                : "bg-white text-[#BF1A1A] border-2 border-[#BF1A1A] hover:bg-[#BF1A1A] hover:text-white"
            }`}
          >
            {addedToCart ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Added to Cart!
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Add to Cart
              </span>
            )}
          </button>

          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            className="w-full py-4 rounded-xl bg-[#BF1A1A] text-white font-bold text-base hover:bg-[#8B1414] transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-2xl"
          >
            <span className="flex items-center justify-center gap-2">
              Buy Now
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Hover Border Animation */}
      <div
        className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(45deg, #BF1A1A 0%, #FFD41D 50%, #BF1A1A 100%)",
          padding: "3px",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
    </div>
  );
}

// Sample products data - use this as reference
export const sampleProducts = [
  {
    id: 1,
    title: "Kent Vegetable Soup",
    category: "Soups",
    description:
      "Premium vegetable soup mix with 100% natural ingredients. Rich, wholesome flavor ready in just 5 minutes. Perfect for a quick, nutritious meal.",
    price: "3.99",
    oldPrice: "5.99",
    discount: 33,
    image: assets.kent,
    badge: "HOT",
    rating: 4.5,
    reviews: 128,
    isHalal: true,
  },
  {
    id: 2,
    title: "Kent Premium Toppings",
    category: "Syrups & Sauces",
    description:
      "Elevate your desserts with our premium toppings. From rich raspberry to luscious caramel, every drop adds magic to your sweet moments.",
    price: "5.99",
    oldPrice: "7.99",
    discount: 25,
    image: assets.topping,
    badge: "NEW",
    rating: 5,
    reviews: 89,
    isHalal: true,
  },
  {
    id: 3,
    title: "SPUDS Craft Cooked Crisps",
    category: "Craft Cooked Crisps",
    description:
      "Experience the ultimate crunch with our craft-cooked potato chips. Hand-selected potatoes, expertly seasoned, perfectly crispy.",
    price: "4.49",
    oldPrice: null,
    discount: null,
    image: assets.spuds,
    badge: "SALE",
    rating: 4.5,
    reviews: 256,
    isHalal: true,
  },
  {
    id: 4,
    title: "Kent Pancake Mix",
    category: "Pancake Mixes",
    description:
      "Fluffy, delicious pancakes in minutes. Our premium pancake mix delivers restaurant-quality breakfast every time. Just add water and cook.",
    price: "6.99",
    oldPrice: "8.99",
    discount: 22,
    image: assets.top2,
    badge: "HOT",
    rating: 4.5,
    reviews: 167,
    isHalal: true,
  },
  {
    id: 5,
    title: "Stock Cubes Variety Pack",
    category: "Stock Cubes",
    description:
      "Essential flavor boosters for your cooking. Includes chicken, beef, and vegetable varieties. All-natural ingredients, no artificial preservatives.",
    price: "4.99",
    oldPrice: null,
    discount: null,
    image: assets.top3,
    badge: null,
    rating: 4,
    reviews: 94,
    isHalal: true,
  },
  {
    id: 6,
    title: "Baby Food Pouch - Mixed Fruits",
    category: "Baby Pouches",
    description:
      "Nutritious and delicious baby food made from 100% organic fruits. No added sugar, preservatives, or artificial colors. Perfect for babies 6+ months.",
    price: "2.99",
    oldPrice: "3.99",
    discount: 25,
    image: assets.top1,
    badge: "NEW",
    rating: 5,
    reviews: 342,
    isHalal: true,
  },
  {
    id: 7,
    title: "Premium Chocolate Syrup",
    category: "Syrups & Sauces",
    description:
      "Rich, decadent chocolate syrup perfect for desserts, drinks, and ice cream. Made with premium cocoa for an indulgent taste experience.",
    price: "5.49",
    oldPrice: null,
    discount: null,
    image: assets.hazelnut,
    badge: null,
    rating: 4.5,
    reviews: 78,
    isHalal: true,
  },
  {
    id: 8,
    title: "SPUDS BBQ Flavored Crisps",
    category: "Craft Cooked Crisps",
    description:
      "Bold BBQ flavor meets perfect crunch. Our signature blend of spices creates an unforgettable snacking experience. Zero trans fat.",
    price: "4.49",
    oldPrice: "5.99",
    discount: 25,
    image: assets.spuds2,
    badge: "SALE",
    rating: 4.5,
    reviews: 189,
    isHalal: true,
  },
];
