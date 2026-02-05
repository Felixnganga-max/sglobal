import React, { useState } from "react";
import { Heart, Clock, User, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { recipesData, getRecipesByCategory } from "../lib/recipesData";
import { assets } from "../assets/assets";

/**
 * Recipes page - Smart Global Limited
 * Colors: Red (#BF1A1A), Yellow (#FFD41D), Black, White, Brown (#7B4019)
 */

const categories = [
  { id: 1, name: "Breakfast", items: 5, icon: "🥞" },
  { id: 2, name: "Soups", items: 1, icon: "🍲" },
  { id: 3, name: "Desserts", items: 4, icon: "🍰" },
  { id: 4, name: "Snacks", items: 2, icon: "🍿" },
  { id: 5, name: "Main Course", items: 1, icon: "🍽️" },
];

// Map image names to actual assets
const getImageFromAssets = (imageName) => {
  const imageMap = {
    top2: assets.top2,
    kent: assets.kent,
    topping: assets.topping,
    spuds: assets.spuds,
    crepes: assets.crepes,
    ice: assets.ice,
  };
  return imageMap[imageName] || assets.top2;
};

export default function Recipes() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const filteredRecipes = getRecipesByCategory(selectedCategory);
  const featuredRecipe = recipesData.find((r) => r.id === 2); // Featured: Creamy Vegetable Soup

  const handleRecipeClick = (slug) => {
    navigate(`/recipes/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero: featured image with overlay title */}
        <section className="relative rounded-3xl overflow-hidden bg-white shadow-2xl border-2 border-[#FFD41D]">
          <div className="h-64 md:h-96 lg:h-[480px] relative">
            <img
              src={getImageFromAssets(featuredRecipe.image)}
              alt={featuredRecipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="absolute left-8 bottom-8 text-white max-w-2xl">
              <div className="inline-block bg-[#FFD41D] text-[#7B4019] px-4 py-1 rounded-full text-xs font-black mb-3">
                FEATURED RECIPE
              </div>
              <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4">
                {featuredRecipe.title}
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{featuredRecipe.cookTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User size={16} />
                  <span>{featuredRecipe.servings} servings</span>
                </div>
                <div className="bg-[#4CAF50] px-3 py-1 rounded-full text-xs font-bold">
                  Halal ✓
                </div>
              </div>
              <button
                onClick={() => handleRecipeClick(featuredRecipe.slug)}
                className="mt-4 bg-[#BF1A1A] hover:bg-[#8B1414] text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View Recipe
              </button>
            </div>
          </div>

          {/* Browse by category */}
          <div className="bg-white px-6 py-10">
            <h3 className="text-center text-2xl font-black text-[#BF1A1A] mb-2">
              Browse by Category
            </h3>
            <p className="text-center text-sm text-[#7B4019] mb-8">
              Discover delicious recipes using our premium products
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              {/* All Categories Button */}
              <button
                onClick={() => setSelectedCategory("All")}
                className={`flex flex-col items-center gap-3 rounded-2xl px-6 py-4 w-32 transition-all duration-300 ${
                  selectedCategory === "All"
                    ? "bg-[#BF1A1A] text-white shadow-xl scale-105"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-lg"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md ${
                    selectedCategory === "All" ? "bg-white" : "bg-white"
                  }`}
                >
                  <ChefHat className="text-[#BF1A1A]" size={28} />
                </div>
                <div className="text-sm font-bold">All Recipes</div>
                <div className="text-xs opacity-80">
                  {recipesData.length} items
                </div>
              </button>

              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`flex flex-col items-center gap-3 rounded-2xl px-6 py-4 w-32 transition-all duration-300 ${
                    selectedCategory === c.name
                      ? "bg-[#BF1A1A] text-white shadow-xl scale-105"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-lg"
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-3xl shadow-md">
                    {c.icon}
                  </div>
                  <div className="text-sm font-bold">{c.name}</div>
                  <div className="text-xs opacity-80">{c.items} recipes</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Recipes grid */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-black text-[#BF1A1A]">
                {selectedCategory === "All"
                  ? "ALL RECIPES"
                  : `${selectedCategory.toUpperCase()} RECIPES`}
              </h3>
              <p className="text-sm text-[#7B4019] mt-1">
                {filteredRecipes.length} delicious recipes using Smart Global
                products
              </p>
            </div>
            {selectedCategory !== "All" && (
              <button
                onClick={() => setSelectedCategory("All")}
                className="text-sm text-[#BF1A1A] font-bold hover:text-[#8B1414] flex items-center gap-2 transition-colors"
              >
                View all
                <svg
                  className="w-4 h-4"
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
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe.slug)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* RecipeCard - Smart Global branded style */
function RecipeCard({ recipe, onClick }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <article className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 hover:border-[#FFD41D] cursor-pointer">
      <div className="relative overflow-hidden" onClick={onClick}>
        <img
          src={getImageFromAssets(recipe.image)}
          alt={recipe.title}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:scale-110 transition-transform duration-300 z-10"
        >
          <Heart
            size={18}
            className={`${
              isLiked ? "fill-[#BF1A1A] text-[#BF1A1A]" : "text-gray-400"
            } transition-colors`}
          />
        </button>

        <div className="absolute top-4 left-4">
          <span className="bg-[#FFD41D] text-[#7B4019] px-3 py-1 rounded-full text-xs font-black shadow-lg">
            {recipe.category}
          </span>
        </div>

        {/* Difficulty badge */}
        <div className="absolute bottom-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
              recipe.difficulty === "Easy"
                ? "bg-green-500"
                : recipe.difficulty === "Medium"
                  ? "bg-orange-500"
                  : "bg-red-500"
            }`}
          >
            {recipe.difficulty}
          </span>
        </div>
      </div>

      <div className="p-6" onClick={onClick}>
        <h4 className="text-xl font-black text-gray-900 leading-tight group-hover:text-[#BF1A1A] transition-colors duration-300 mb-3 line-clamp-2">
          {recipe.title}
        </h4>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1.5">
            <Clock size={16} className="text-[#BF1A1A]" />
            <span className="font-semibold">{recipe.totalTime}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <User size={16} className="text-[#BF1A1A]" />
            <span className="font-semibold">{recipe.servings} servings</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="font-semibold">{recipe.rating}</span>
            <span className="text-gray-400">({recipe.reviews})</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#BF1A1A] to-[#8B1414] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
              {recipe.author.avatar}
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">
                {recipe.author.name}
              </div>
              <div className="text-xs text-gray-500">{recipe.date}</div>
            </div>
          </div>

          <div className="bg-[#4CAF50] text-white px-2.5 py-1 rounded-full text-xs font-bold">
            Halal ✓
          </div>
        </div>

        <button className="w-full mt-4 py-3 rounded-xl bg-white text-[#BF1A1A] border-2 border-[#BF1A1A] font-bold text-sm hover:bg-[#BF1A1A] hover:text-white transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-xl">
          View Recipe
        </button>
      </div>
    </article>
  );
}
