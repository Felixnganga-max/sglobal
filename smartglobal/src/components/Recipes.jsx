import React, { useRef } from "react";
import { Heart, Clock, ChefHat, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const categories = [
  {
    id: 1,
    title: "Premium Soups",
    subtitle: "Ready in 5 Minutes",
    image: assets.kent,
    accent: "#FF7F11",
  },
  {
    id: 2,
    title: "Pancake Mixes",
    subtitle: "Fluffy & Delicious",
    image: assets.crepes,
    accent: "#FF0000",
  },
  {
    id: 3,
    title: "Sweet Toppings",
    subtitle: "Desserts Elevated",
    image: assets.topping,
    accent: "#FF7F11",
  },
];

const recipes = [
  {
    id: 1,
    title: "Hearty Vegetable Soup",
    description:
      "Made with Kent Boringer Premium Vegetable Soup mix — wholesome, natural, and ready in just 5 minutes.",
    time: "5 min",
    difficulty: "Easy",
    servings: 4,
    product: "Kent Vegetable Soup",
    image: assets.kent,
    accent: "#FF7F11",
  },
  {
    id: 2,
    title: "Fluffy Morning Pancakes",
    description:
      "Perfect breakfast using our premium pancake mix. Just add water, cook, and top with Kent syrups.",
    time: "10 min",
    difficulty: "Easy",
    servings: 4,
    product: "Kent Pancake Mix",
    image: assets.crepes,
    accent: "#FF0000",
  },
  {
    id: 3,
    title: "Dessert Delight Sundae",
    description:
      "Elevate your ice cream with Kent Boringer premium toppings — rich, smooth, and irresistible.",
    time: "2 min",
    difficulty: "Easy",
    servings: 2,
    product: "Kent Premium Toppings",
    image: assets.topping,
    accent: "#FF7F11",
  },
];

export default function Recipes() {
  const catScrollRef = useRef(null);
  const recipeScrollRef = useRef(null);

  const scroll = (ref, dir) => {
    if (ref.current)
      ref.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <main className="w-full bg-white">
      {/* ── Category Strip ── */}
      <section className="section-y page-x">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-eyebrow mb-1">Cook With Us</p>
            <h2 className="text-section-title text-gray-900">By Category</h2>
            <div className="section-rule mt-2" />
          </div>
          <div className="flex gap-2 sm:hidden">
            {[
              [-1, "M15 19l-7-7 7-7"],
              [1, "M9 5l7 7-7 7"],
            ].map(([dir, d]) => (
              <button
                key={dir}
                onClick={() => scroll(catScrollRef, dir)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={d} />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div
          ref={catScrollRef}
          className="flex gap-4 overflow-x-auto sm:overflow-visible sm:grid sm:grid-cols-3 pb-1 sm:pb-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <Link
              to="/products"
              key={cat.id}
              className="group relative flex-shrink-0 w-[210px] sm:w-auto rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400"
              style={{ height: "220px" }}
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              {/* accent top bar */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: cat.accent }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p
                  className="font-body text-[0.6rem] font-bold uppercase tracking-[0.2em] mb-0.5"
                  style={{ color: cat.accent }}
                >
                  {cat.subtitle}
                </p>
                <h3 className="font-heading text-white text-base font-bold leading-tight">
                  {cat.title}
                </h3>
                <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-body text-white text-xs font-semibold">
                    Explore
                  </span>
                  <ArrowRight size={12} className="text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recipe Cards ── */}
      <section
        className="section-y page-x"
        style={{ backgroundColor: "#f9fafb" }}
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-eyebrow mb-1">Smart Global Kitchen</p>
            <h2 className="text-section-title text-gray-900">
              Recipe Inspiration
            </h2>
            <div className="section-rule mt-2" />
            <p className="font-body text-sm text-muted mt-2 max-w-sm">
              Delicious ideas using our premium products — quick, easy, and
              always satisfying.
            </p>
          </div>
          {/* mobile arrows */}
          <div className="flex gap-2 sm:hidden">
            {[
              [-1, "M15 19l-7-7 7-7"],
              [1, "M9 5l7 7-7 7"],
            ].map(([dir, d]) => (
              <button
                key={dir}
                onClick={() => scroll(recipeScrollRef, dir)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={d} />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: horizontal scroll / Desktop: grid */}
        <div
          ref={recipeScrollRef}
          className="flex gap-4 overflow-x-auto sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-3 pb-2 sm:pb-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="page-x section-y">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ minHeight: "160px" }}
        >
          <img
            src={assets.recipe}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/80 to-gray-950/40" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-7 sm:p-10">
            <div>
              <p className="text-eyebrow mb-1" style={{ color: "#FF7F11" }}>
                Hungry for More?
              </p>
              <h3 className="font-heading text-white text-xl sm:text-2xl font-bold leading-tight">
                Discover More Recipes
                <br className="hidden sm:block" /> & Cooking Ideas
              </h3>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link
                to="/recipes"
                className="group inline-flex items-center gap-2 btn-secondary text-xs"
              >
                All Recipes
                <ArrowRight
                  size={13}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
              <Link
                to="/contact"
                className="font-body text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full border border-white/30 text-white hover:bg-white/10 transition-all duration-300 inline-flex items-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── Recipe Card ── */
function RecipeCard({ recipe }) {
  return (
    <article className="group relative flex-shrink-0 w-[78vw] sm:w-auto bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col">
      {/* Image — full bleed top half */}
      <div className="relative overflow-hidden h-44 sm:h-52 flex-shrink-0">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Product chip */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
          <ChefHat size={11} className="text-gray-500" />
          <span className="font-body text-[0.6rem] font-bold text-gray-700 uppercase tracking-wide">
            {recipe.product}
          </span>
        </div>

        {/* Fav button */}
        <button
          aria-label={`Save ${recipe.title}`}
          className="absolute top-3 right-3 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm"
        >
          <Heart size={13} />
        </button>

        {/* Meta — time & servings pinned over image bottom */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
            <Clock size={10} className="text-white" />
            <span className="font-body text-[0.6rem] text-white font-semibold">
              {recipe.time}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="font-body text-[0.6rem] text-white font-semibold">
              {recipe.servings} servings
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Accent rule */}
          <div
            className="w-8 h-0.5 mb-3 rounded-full"
            style={{ backgroundColor: recipe.accent }}
          />
          <h3 className="font-heading text-gray-900 text-base font-bold leading-tight mb-2">
            {recipe.title}
          </h3>
          <p className="font-body text-xs text-muted leading-relaxed line-clamp-2">
            {recipe.description}
          </p>
        </div>

        <Link
          to="/recipes"
          className="group/btn mt-4 inline-flex items-center gap-1.5 font-body text-xs font-bold uppercase tracking-widest transition-colors duration-200"
          style={{ color: recipe.accent }}
        >
          View Recipe
          <ArrowRight
            size={12}
            className="group-hover/btn:translate-x-0.5 transition-transform"
          />
        </Link>
      </div>
    </article>
  );
}
