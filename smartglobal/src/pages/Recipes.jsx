import React, { useEffect, useState } from "react";
import { Heart, Clock, User, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { recipesData, getRecipesByCategory } from "../lib/recipesData";
import { assets } from "../assets/assets";

const categories = [
  { id: 1, name: "Breakfast", icon: "🥞" },
  { id: 2, name: "Soups", icon: "🍲" },
  { id: 3, name: "Desserts", icon: "🍰" },
  { id: 4, name: "Snacks", icon: "🍿" },
  { id: 5, name: "Main Course", icon: "🍽️" },
];

const getImageFromAssets = (name) =>
  ({
    top2: assets.top2,
    kent: assets.kent,
    topping: assets.topping,
    spuds: assets.spuds,
    crepes: assets.crepes,
    ice: assets.ice,
  })[name] || assets.top2;

export default function Recipes() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();
  const filteredRecipes = getRecipesByCategory(selectedCategory);
  const featuredRecipe = recipesData.find((r) => r.id === 2);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "380px" }}
      >
        <img
          src={assets.recipe}
          alt={featuredRecipe.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 page-x pb-8">
          <span
            className="inline-block px-3 py-1 rounded-full font-body text-[0.6rem] font-bold uppercase tracking-widest text-white mb-3"
            style={{ backgroundColor: "var(--color-orange)" }}
          >
            Featured Recipe
          </span>
          <h2
            className="font-heading font-bold text-white mb-2"
            style={{
              fontSize: "clamp(1.3rem, 3vw, 2rem)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {featuredRecipe.title}
          </h2>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="flex items-center gap-1.5 font-body text-xs text-white/80">
              <Clock size={12} /> {featuredRecipe.cookTime}
            </span>
            <span className="flex items-center gap-1.5 font-body text-xs text-white/80">
              <User size={12} /> {featuredRecipe.servings} servings
            </span>
            <span
              className="font-body text-[0.6rem] font-bold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: "#4CAF50" }}
            >
              Halal ✓
            </span>
          </div>
          <button
            onClick={() => navigate(`/recipes/${featuredRecipe.slug}`)}
            className="btn-secondary"
            style={{ fontSize: "0.62rem" }}
          >
            View Recipe
          </button>
        </div>
      </div>

      {/* ── Category filter ── */}
      <div
        className="page-x py-8"
        style={{ backgroundColor: "var(--color-bg-soft)" }}
      >
        <div className="text-center mb-6">
          <p className="text-eyebrow mb-1">Browse</p>
          <h3
            className="font-heading font-bold text-base"
            style={{ color: "var(--color-text)" }}
          >
            Recipes by Category
          </h3>
          <div className="section-rule-center mt-2" />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {/* All */}
          <button
            onClick={() => setSelectedCategory("All")}
            className="flex flex-col items-center gap-2 px-5 py-3 rounded-xl transition-all duration-200 font-body"
            style={{
              backgroundColor:
                selectedCategory === "All" ? "var(--color-orange)" : "#fff",
              color: selectedCategory === "All" ? "#fff" : "var(--color-text)",
              border: `1px solid ${selectedCategory === "All" ? "var(--color-orange)" : "var(--color-border)"}`,
              minWidth: "80px",
            }}
          >
            <ChefHat
              size={18}
              style={{
                color:
                  selectedCategory === "All" ? "#fff" : "var(--color-orange)",
              }}
            />
            <span className="text-xs font-bold">All</span>
            <span className="text-[0.58rem] opacity-70">
              {recipesData.length} recipes
            </span>
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.name)}
              className="flex flex-col items-center gap-2 px-5 py-3 rounded-xl transition-all duration-200 font-body"
              style={{
                backgroundColor:
                  selectedCategory === c.name ? "var(--color-orange)" : "#fff",
                color:
                  selectedCategory === c.name ? "#fff" : "var(--color-text)",
                border: `1px solid ${selectedCategory === c.name ? "var(--color-orange)" : "var(--color-border)"}`,
                minWidth: "80px",
              }}
            >
              <span className="text-lg">{c.icon}</span>
              <span className="text-xs font-bold">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Recipes grid ── */}
      <div className="page-x section-y">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-eyebrow mb-1">
              {selectedCategory === "All" ? "All Recipes" : selectedCategory}
            </p>
            <div className="section-rule-orange mt-1" />
          </div>
          {selectedCategory !== "All" && (
            <button
              onClick={() => setSelectedCategory("All")}
              className="font-body text-xs font-bold transition-colors"
              style={{ color: "var(--color-orange)" }}
            >
              View all →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => navigate(`/recipes/${recipe.slug}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RecipeCard({ recipe, onClick }) {
  const [liked, setLiked] = useState(false);
  const difficultyColor = {
    Easy: "#4CAF50",
    Medium: "var(--color-orange)",
    Hard: "var(--color-red)",
  };

  return (
    <article
      className="bg-white rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-lg"
      style={{ border: "1px solid var(--color-border)" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "var(--color-orange)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--color-border)")
      }
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ height: "200px" }}
        onClick={onClick}
      >
        <img
          src={getImageFromAssets(recipe.image)}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
        >
          <Heart
            size={13}
            style={{
              fill: liked ? "var(--color-red)" : "transparent",
              color: liked ? "var(--color-red)" : "#9ca3af",
            }}
          />
        </button>
        {/* Category */}
        <span
          className="absolute top-3 left-3 font-body text-[0.58rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: "var(--color-orange)" }}
        >
          {recipe.category}
        </span>
        {/* Difficulty */}
        <span
          className="absolute bottom-3 left-3 font-body text-[0.58rem] font-bold px-2 py-0.5 rounded-full text-white"
          style={{
            backgroundColor:
              difficultyColor[recipe.difficulty] || "var(--color-muted)",
          }}
        >
          {recipe.difficulty}
        </span>
      </div>

      {/* Body */}
      <div className="p-4" onClick={onClick}>
        <h4
          className="font-heading font-bold text-sm leading-snug mb-1.5 line-clamp-2 transition-colors"
          style={{ color: "var(--color-text)" }}
        >
          {recipe.title}
        </h4>
        <p
          className="font-body text-[0.62rem] line-clamp-2 mb-3"
          style={{ color: "var(--color-muted)" }}
        >
          {recipe.description}
        </p>

        <div className="flex items-center gap-4 mb-3">
          <span
            className="flex items-center gap-1 font-body text-[0.62rem]"
            style={{ color: "var(--color-muted)" }}
          >
            <Clock size={11} style={{ color: "var(--color-orange)" }} />{" "}
            {recipe.totalTime}
          </span>
          <span
            className="flex items-center gap-1 font-body text-[0.62rem]"
            style={{ color: "var(--color-muted)" }}
          >
            <User size={11} style={{ color: "var(--color-orange)" }} />{" "}
            {recipe.servings} servings
          </span>
          <span
            className="flex items-center gap-0.5 font-body text-[0.62rem]"
            style={{ color: "var(--color-muted)" }}
          >
            <span style={{ color: "var(--color-orange)" }}>★</span>{" "}
            {recipe.rating}
          </span>
        </div>

        <div
          className="flex items-center justify-between pt-3 border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-orange) 0%, var(--color-orange-dark) 100%)",
              }}
            >
              {recipe.author.avatar}
            </div>
            <span
              className="font-body text-[0.62rem] font-semibold"
              style={{ color: "var(--color-text)" }}
            >
              {recipe.author.name}
            </span>
          </div>
          <span
            className="font-body text-[0.58rem] font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: "#4CAF50" }}
          >
            Halal ✓
          </span>
        </div>
      </div>
    </article>
  );
}
