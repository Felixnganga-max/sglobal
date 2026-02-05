import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  User,
  Download,
  Heart,
  Share2,
  Printer,
  ChefHat,
  Utensils,
  Timer,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import {
  recipesData,
  getRecipesByCategory,
  getRecipeBySlug,
  getRelatedRecipes,
  getFeaturedRecipes,
} from "../lib/recipesData";

import { assets } from "../assets/assets";

/**
 * RecipeDetail page - single recipe view
 * Smart Global Limited branding
 */

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

export default function RecipeDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const recipe = getRecipeBySlug(slug);

  const [isLiked, setIsLiked] = useState(false);
  const [cookingMode, setCookingMode] = useState(false);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recipe not found
          </h2>
          <button
            onClick={() => navigate("/recipes")}
            className="bg-[#BF1A1A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#8B1414] transition-colors"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  const relatedRecipes = getRelatedRecipes(recipe.id, recipe.category);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back button */}
        <button
          onClick={() => navigate("/recipes")}
          className="flex items-center gap-2 text-[#BF1A1A] hover:text-[#8B1414] font-semibold mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Recipes
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <main className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
            <nav className="text-xs text-gray-500 mb-4">
              Home &gt; Recipes &gt; {recipe.category}
            </nav>

            {/* Recipe header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#FFD41D] text-[#7B4019] px-3 py-1 rounded-full text-xs font-black">
                  {recipe.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                    recipe.difficulty === "Easy"
                      ? "bg-green-500"
                      : recipe.difficulty === "Medium"
                        ? "bg-orange-500"
                        : "bg-red-500"
                  }`}
                >
                  {recipe.difficulty}
                </span>
                <span className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-xs font-bold">
                  Halal ✓
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
                {recipe.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <Rating value={recipe.rating} />
                  <span className="ml-2 font-semibold text-gray-700">
                    {recipe.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-400">
                    ({recipe.reviews} reviews)
                  </span>
                </div>

                <div className="text-gray-400">|</div>

                <div className="flex items-center gap-1">
                  <span className="text-gray-700">by</span>
                  <span className="text-[#BF1A1A] font-bold">
                    {recipe.author.name}
                  </span>
                </div>

                <div className="text-gray-400">|</div>

                <div className="flex items-center gap-1">
                  <TrendingUp size={14} className="text-[#BF1A1A]" />
                  <span>{recipe.views} views</span>
                </div>

                <div className="text-gray-400">|</div>

                <div className="text-gray-500">
                  Updated: {recipe.lastUpdated}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <ActionButton
                  icon={<Heart size={16} />}
                  label={isLiked ? "SAVED" : "SAVE"}
                  onClick={() => setIsLiked(!isLiked)}
                  active={isLiked}
                />
                <ActionButton icon={<Star size={16} />} label="RATE" />
                <ActionButton
                  icon={<Printer size={16} />}
                  label="PRINT"
                  onClick={handlePrint}
                />
                <ActionButton
                  icon={<Share2 size={16} />}
                  label="SHARE"
                  onClick={handleShare}
                />
              </div>
            </div>

            {/* Hero image */}
            <div className="relative rounded-2xl overflow-hidden mb-8 shadow-xl border-2 border-[#FFD41D]">
              <img
                src={getImageFromAssets(recipe.image)}
                alt={recipe.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <div className="flex items-center gap-6 text-white text-sm">
                  <div className="flex items-center gap-2">
                    <Timer size={18} />
                    <span className="font-bold">{recipe.totalTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={18} />
                    <span className="font-bold">
                      {recipe.servings} servings
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Utensils size={18} />
                    <span className="font-bold">{recipe.difficulty}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <section className="mb-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                {recipe.description}
              </p>
            </section>

            {/* Ingredients & Directions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Ingredients */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#BF1A1A] rounded-full flex items-center justify-center">
                    <ChefHat className="text-white" size={20} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">
                    Ingredients
                  </h3>
                </div>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <span className="w-6 h-6 bg-[#FFD41D] rounded-full flex items-center justify-center text-[#7B4019] font-bold text-xs flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Directions */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#BF1A1A] rounded-full flex items-center justify-center">
                    <Utensils className="text-white" size={20} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">
                    Directions
                  </h3>
                </div>
                <ol className="space-y-4">
                  {recipe.directions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-[#BF1A1A] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-gray-700 leading-relaxed pt-1">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Tips & Nutrition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pro Tips */}
              {recipe.tips && recipe.tips.length > 0 && (
                <div className="bg-[#FFF9E6] rounded-2xl p-6 border-2 border-[#FFD41D]">
                  <h3 className="text-xl font-black text-[#7B4019] mb-4 flex items-center gap-2">
                    <span className="text-2xl">💡</span> Pro Tips
                  </h3>
                  <ul className="space-y-2">
                    {recipe.tips.map((tip, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-[#BF1A1A] font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Nutrition */}
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                <h3 className="text-xl font-black text-green-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🥗</span> Nutrition (per serving)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <NutritionItem
                    label="Calories"
                    value={recipe.nutrition.calories}
                  />
                  <NutritionItem
                    label="Protein"
                    value={recipe.nutrition.protein}
                  />
                  <NutritionItem label="Carbs" value={recipe.nutrition.carbs} />
                  <NutritionItem label="Fat" value={recipe.nutrition.fat} />
                  {recipe.nutrition.fiber && (
                    <NutritionItem
                      label="Fiber"
                      value={recipe.nutrition.fiber}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-bold text-gray-500 mb-3">TAGS</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </main>

          {/* Right sidebar */}
          <aside className="space-y-6">
            {/* Quick Summary Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#FFD41D] sticky top-6">
              <div className="mb-4">
                <h3 className="text-lg font-black text-[#BF1A1A] mb-1">
                  Quick Summary
                </h3>
                <p className="text-xs text-gray-500">Recipe at a glance</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <Stat label="Prep Time" value={recipe.prepTime} />
                <Stat label="Cook Time" value={recipe.cookTime} />
                <Stat label="Total Time" value={recipe.totalTime} />
                <Stat label="Servings" value={`${recipe.servings} people`} />
                <Stat label="Difficulty" value={recipe.difficulty} />
                <Stat label="Rating" value={`${recipe.rating} ★`} />
              </div>

              <button className="w-full inline-flex items-center justify-center gap-2 bg-[#BF1A1A] hover:bg-[#8B1414] text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-xl mb-4">
                <Download size={18} /> Download PDF
              </button>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-700">
                  Cooking Mode
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={cookingMode}
                    onChange={(e) => setCookingMode(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#BF1A1A] rounded-full peer-focus:outline-none transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5 shadow-sm"></div>
                </label>
              </div>
            </div>

            {/* Author Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <h3 className="text-sm font-black text-gray-900 mb-4">
                RECIPE BY
              </h3>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#BF1A1A] to-[#8B1414] rounded-full flex items-center justify-center text-white font-black text-xl shadow-md flex-shrink-0">
                  {recipe.author.avatar}
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {recipe.author.name}
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    {recipe.author.bio}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{recipe.date}</span>
                    <span>•</span>
                    <span>{recipe.views} views</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Recipes */}
            {relatedRecipes.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                <h3 className="text-sm font-black text-gray-900 mb-4">
                  RELATED RECIPES
                </h3>
                <div className="space-y-4">
                  {relatedRecipes.map((related) => (
                    <div
                      key={related.id}
                      onClick={() => {
                        navigate(`/recipes/${related.slug}`);
                        window.scrollTo(0, 0);
                      }}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <img
                        src={getImageFromAssets(related.image)}
                        alt={related.title}
                        className="w-20 h-20 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#BF1A1A] transition-colors line-clamp-2 leading-tight mb-1">
                          {related.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{related.totalTime}</span>
                          <span>•</span>
                          <span className="text-yellow-400">★</span>
                          <span>{related.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

/* Helper Components */

function Rating({ value = 5 }) {
  const stars = new Array(5).fill(0);
  return (
    <div className="inline-flex items-center">
      {stars.map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < Math.round(value)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function ActionButton({ icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
        active
          ? "bg-[#BF1A1A] text-white shadow-md"
          : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border-2 border-gray-100 rounded-xl p-3 text-center bg-white">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-black text-gray-900">{value}</div>
    </div>
  );
}

function NutritionItem({ label, value }) {
  return (
    <div className="bg-white rounded-lg p-3 border border-green-200">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="text-lg font-black text-green-800">{value}</div>
    </div>
  );
}
