import React from "react";
import { Heart, Clock, ChefHat, ArrowRight } from "lucide-react";
import { assets } from "../assets/assets";

/**
 * Recipes Component - Smart Global Premium Foods
 * 
 * Features:
 * - 3 category cards showcasing product categories
 * - 3 featured recipe cards using Smart Global products
 * - Horizontal scrolling on mobile devices
 * - "Explore More Recipes" CTA linking to /recipes
 */

export default function Recipes() {
  // Product categories matching Smart Global brand
  const categories = [
    {
      id: 1,
      title: "Premium Soups",
      subtitle: "Ready in 5 Minutes",
      bgClass: "bg-gradient-to-br from-[#4CAF50]/10 to-[#4CAF50]/5",
      imgSrc: assets.kent,
    },
    {
      id: 2,
      title: "Pancake Mixes",
      subtitle: "Fluffy & Delicious",
      bgClass: "bg-gradient-to-br from-[#FFD41D]/20 to-[#FFD41D]/5",
      imgSrc: assets.top2,
    },
    {
      id: 3,
      title: "Premium Toppings",
      subtitle: "Sweet Perfection",
      bgClass: "bg-gradient-to-br from-[#BF1A1A]/10 to-[#BF1A1A]/5",
      imgSrc: assets.topping,
    },
  ];

  // Featured recipes using Smart Global products
  const recipes = [
    {
      id: 1,
      title: "Hearty Vegetable Soup",
      description: "Made with Kent Boringer Premium Vegetable Soup mix - ready in just 5 minutes!",
      tags: ["Halal", "100% Natural"],
      time: "5 min",
      difficulty: "Easy",
      servings: 4,
      product: "Kent Vegetable Soup",
      imgSrc: assets.kent,
    },
    {
      id: 2,
      title: "Fluffy Morning Pancakes",
      description: "Perfect breakfast using our premium pancake mix - just add water and cook!",
      tags: ["Halal", "Quick Breakfast"],
      time: "10 min",
      difficulty: "Easy",
      servings: 4,
      product: "Kent Pancake Mix",
      imgSrc: assets.top2,
    },
    {
      id: 3,
      title: "Dessert Delight Sundae",
      description: "Top your ice cream with Kent Boringer Premium Toppings for the ultimate treat!",
      tags: ["Halal", "Sweet Treat"],
      time: "2 min",
      difficulty: "Easy",
      servings: 2,
      product: "Kent Premium Toppings",
      imgSrc: assets.topping,
    },
  ];

  return (
    <main className="w-full px-6 lg:px-12 py-12">
      {/* Category Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`${cat.bgClass} rounded-2xl p-6 flex items-center gap-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100`}
          >
            <img
              src={cat.imgSrc}
              alt={cat.title}
              className="w-24 h-24 rounded-xl object-cover flex-shrink-0 shadow-md"
            />
            <div className="flex-1">
              <div
                className="text-lg font-black text-gray-900 tracking-tight"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {cat.title}
              </div>
              <div className="text-xs text-gray-600 font-semibold mt-1">
                {cat.subtitle}
              </div>
              <button className="mt-3 text-xs px-4 py-2 bg-[#BF1A1A] text-white rounded-full font-bold hover:bg-[#8B1414] transition-all duration-300 shadow-md uppercase tracking-wide">
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Section Header */}
      <header className="text-center mb-10">
        <h2
          className="text-4xl sm:text-5xl font-black text-gray-900"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          RECIPE <span className="text-[#BF1A1A]">INSPIRATION</span>
        </h2>
        <p className="mt-3 text-gray-600 font-semibold text-lg">
          Delicious recipes made easy with Smart Global premium products
        </p>
      </header>

      {/* Recipe Cards - Horizontal Scroll on Mobile */}
      <section className="mb-12">
        {/* Desktop: Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="sm:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="flex-shrink-0 w-[85vw] snap-center">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      </section>

      {/* Explore More CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-[#BF1A1A] to-[#8B1414] text-white p-8 lg:p-10 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <div
              className="text-3xl sm:text-4xl font-black tracking-tight"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              HUNGRY FOR MORE?
            </div>
            <div className="text-base sm:text-lg opacity-90 font-semibold mt-2">
              Discover hundreds of delicious recipes using our premium products
            </div>
          </div>

          <a
            href="/recipes"
            className="group flex items-center gap-3 px-8 py-4 bg-white text-[#BF1A1A] rounded-full font-black text-base shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 uppercase tracking-wide"
          >
            Explore More Recipes
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;600;700;800;900&display=swap");
        
        /* Hide scrollbar for mobile horizontal scroll */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}

// Recipe Card Component
function RecipeCard({ recipe }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100 flex flex-col hover:shadow-2xl hover:border-[#BF1A1A] transition-all duration-300 group h-full">
      {/* Recipe Image */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={recipe.imgSrc}
          alt={recipe.title}
          className="w-full h-56 object-contain p-6 group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Product Badge */}
        <div className="absolute top-4 left-4 bg-white/95 px-3 py-2 rounded-full text-xs font-bold text-gray-700 shadow-lg">
          <ChefHat className="inline-block h-3 w-3 mr-1" />
          {recipe.product}
        </div>

        {/* Favorite Button */}
        <button
          aria-label={`Favorite ${recipe.title}`}
          className="absolute top-4 right-4 bg-white/95 p-2.5 rounded-full shadow-lg hover:bg-[#BF1A1A] hover:text-white transition-all duration-300"
        >
          <Heart size={18} />
        </button>

        {/* Halal Badge */}
        <div className="absolute bottom-4 left-4 bg-[#4CAF50] text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          ✓ Halal Certified
        </div>
      </div>

      {/* Recipe Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-black text-gray-900 leading-tight">
            {recipe.title}
          </h3>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            {recipe.description}
          </p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {recipe.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-bold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Recipe Details & CTA */}
        <div className="mt-5 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600 font-semibold mb-4">
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-[#BF1A1A]" />
              <span>{recipe.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat size={14} className="text-[#BF1A1A]" />
              <span>{recipe.difficulty}</span>
            </div>
            <div className="text-gray-600">
              {recipe.servings} servings
            </div>
          </div>

          <button className="w-full py-3 bg-[#BF1A1A] hover:bg-[#8B1414] text-white rounded-xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2">
            View Full Recipe
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}