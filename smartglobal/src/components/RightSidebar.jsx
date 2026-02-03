import React from "react";

/**
 * RightSidebar.jsx
 * Desktop-only panel for trending products and top sellers
 * Colors: Red (#BF1A1A), Yellow (#FFD41D), Black, White, Brown (#7B4019)
 * No icons - using images only
 */

const trending = [
  {
    id: 1,
    title: "Aptamil Gold+ ProNutra Birlik Stage 1 Infant",
    price: "8.99",
    oldPrice: "10.99",
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80",
    discount: "20%",
  },
  {
    id: 2,
    title: "Green Fresh Organic Lettuce",
    price: "2.45",
    oldPrice: "4.18",
    image:
      "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&q=80",
    discount: "40%",
  },
  {
    id: 3,
    title: "Simply Orange Pop Tree Juice - 52 fl oz",
    price: "2.45",
    oldPrice: "4.18",
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
    discount: "40%",
  },
  {
    id: 4,
    title: "Chanise Cabbage Market, Organic Fresh",
    price: "0.50",
    oldPrice: "1.80",
    image:
      "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&q=80",
    discount: "72%",
  },
];

const topSellers = [
  {
    id: 1,
    name: "Eleanor Pena",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    products: "128 Products",
  },
  {
    id: 2,
    name: "Robert Fox",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    products: "95 Products",
  },
  {
    id: 3,
    name: "Jane Cooper",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    products: "82 Products",
  },
];

export default function RightSidebar() {
  return (
    <aside className="space-y-6 sticky top-6">
      {/* Trending Products */}
      <div className="rounded-2xl border-2 border-[#FFD41D] bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-black">Trending Products</h4>
          <div className="px-3 py-1 bg-[#FFF8E7] rounded-full">
            <span className="text-xs font-bold text-[#BF1A1A]">Today</span>
          </div>
        </div>

        <ul className="space-y-4">
          {trending.map((product) => (
            <li
              key={product.id}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#FFF8E7] transition-colors cursor-pointer"
            >
              {/* Product Image */}
              <div className="flex-shrink-0 w-20 h-20 bg-[#FFF8E7] rounded-xl p-2 border-2 border-[#FFD41D]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-black line-clamp-2 mb-2">
                  {product.title}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#BF1A1A]">
                    ${product.price}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ${product.oldPrice}
                  </span>
                </div>
                {product.discount && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-[#BF1A1A] text-white text-xs font-bold rounded">
                    {product.discount} OFF
                  </span>
                )}
              </div>

              {/* Add Button */}
              <button className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FFD41D] flex items-center justify-center hover:bg-[#BF1A1A] transition-colors group">
                <img
                  src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&q=80"
                  alt="Add to cart"
                  className="w-5 h-5 rounded-full object-cover group-hover:brightness-0 group-hover:invert"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Top Seller Users */}
      <div className="rounded-2xl border-2 border-[#FFD41D] bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-black">Top Seller Users</h4>
        </div>

        <ul className="space-y-4">
          {topSellers.map((seller) => (
            <li
              key={seller.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFF8E7] transition-colors cursor-pointer"
            >
              {/* Seller Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={seller.image}
                  alt={seller.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#FFD41D]"
                />
              </div>

              {/* Seller Info */}
              <div className="flex-1">
                <div className="text-sm font-bold text-black mb-1">
                  {seller.name}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[#FFD41D] text-lg">★</span>
                    <span className="text-sm font-medium text-[#7B4019]">
                      {seller.rating}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-[#7B4019]">
                    {seller.products}
                  </span>
                </div>
              </div>

              {/* View Profile Image */}
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&q=80"
                alt="View"
                className="w-6 h-6 rounded-full object-cover opacity-50 hover:opacity-100 transition-opacity"
              />
            </li>
          ))}
        </ul>

        {/* View All Button */}
        <button className="w-full mt-4 py-3 rounded-full border-2 border-[#FFD41D] text-[#BF1A1A] font-bold hover:bg-[#BF1A1A] hover:text-white transition-colors">
          View All Sellers
        </button>
      </div>

      {/* Mini Banner */}
      <div className="rounded-2xl bg-[#7B4019] p-6 text-white text-center shadow-lg">
        <div className="mb-4">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80"
            alt="Special offer"
            className="w-20 h-20 mx-auto rounded-full object-cover border-4 border-white"
          />
        </div>
        <h5 className="text-lg font-bold mb-2">Special Offer!</h5>
        <p className="text-sm mb-4 opacity-90">
          Get 20% off on your first order
        </p>
        <button className="w-full py-3 rounded-full bg-[#FFD41D] text-black font-bold hover:bg-white transition-colors">
          Shop Now
        </button>
      </div>
    </aside>
  );
}
