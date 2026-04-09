import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
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
import { getRecipeBySlug, getRelatedRecipes } from "../lib/recipesData";
import { assets } from "../assets/assets";

const getImageFromAssets = (name) =>
  ({
    top2: assets.top2,
    kent: assets.kent,
    topping: assets.topping,
    spuds: assets.spuds,
    crepes: assets.crepes,
    ice: assets.ice,
  })[name] || assets.top2;

const difficultyColor = {
  Easy: "#4CAF50",
  Medium: "var(--color-orange)",
  Hard: "var(--color-red)",
};

export default function RecipeDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const recipe = getRecipeBySlug(slug);
  const [liked, setLiked] = useState(false);
  const [cookingMode, setCookingMode] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const printRef = useRef(null);

  if (!recipe)
    return (
      <div className="min-h-screen flex items-center justify-center page-x">
        <div className="text-center">
          <p
            className="font-heading font-bold text-lg mb-3"
            style={{ color: "var(--color-text)" }}
          >
            Recipe not found
          </p>
          <button
            onClick={() => navigate("/recipes")}
            className="btn-secondary"
            style={{ fontSize: "0.62rem" }}
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );

  const related = getRelatedRecipes(recipe.id, recipe.category);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  // ── PRINT: plain window.print(). The <style> block below fixes the hero image. ──
  const handlePrint = () => window.print();

  // ── DOWNLOAD: html2canvas snapshot → jsPDF ──
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <>
      {/* ── Print-only styles: ONLY fixes the hero image for window.print() ── */}
      <style>{`
        @media print {
          .recipe-hero { position: relative !important; height: 260px !important; }
          .recipe-hero img {
            position: relative !important;
            display: block !important;
            width: 100% !important;
            height: 260px !important;
            object-fit: cover !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .recipe-hero .absolute.inset-0:not(img) { display: none !important; }
          .print-hide { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-white" ref={printRef}>
        {/* ── Hero image ── */}
        <div
          className="recipe-hero relative w-full overflow-hidden"
          style={{ height: "320px" }}
        >
          <img
            src={getImageFromAssets(recipe.image)}
            alt={recipe.title}
            className="absolute inset-0 w-full h-full object-cover"
            crossOrigin="anonymous"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 page-x pb-6">
            <button
              onClick={() => navigate("/recipes")}
              className="print-hide flex items-center gap-1.5 font-body text-xs font-bold text-white/70 hover:text-white mb-3 transition-colors"
            >
              <ArrowLeft size={13} /> Back to Recipes
            </button>
            <div className="flex flex-wrap gap-2 mb-2">
              <span
                className="font-body text-[0.58rem] font-bold px-2 py-0.5 rounded-full text-white uppercase tracking-widest"
                style={{ backgroundColor: "var(--color-orange)" }}
              >
                {recipe.category}
              </span>
              <span
                className="font-body text-[0.58rem] font-bold px-2 py-0.5 rounded-full text-white"
                style={{
                  backgroundColor: difficultyColor[recipe.difficulty] || "#999",
                }}
              >
                {recipe.difficulty}
              </span>
              <span
                className="font-body text-[0.58rem] font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: "#4CAF50" }}
              >
                Halal ✓
              </span>
            </div>
            <h1
              className="font-heading font-bold text-white"
              style={{
                fontSize: "clamp(1.2rem, 2.8vw, 2rem)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                lineHeight: 1.15,
              }}
            >
              {recipe.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <span className="flex items-center gap-1 font-body text-[0.65rem] text-white/75">
                <Star
                  size={11}
                  style={{
                    fill: "var(--color-orange)",
                    color: "var(--color-orange)",
                  }}
                />
                {recipe.rating?.toFixed(1)} ({recipe.reviews} reviews)
              </span>
              <span className="flex items-center gap-1 font-body text-[0.65rem] text-white/75">
                <TrendingUp size={11} /> {recipe.views} views
              </span>
            </div>
          </div>
        </div>

        <div className="page-x section-y">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Main column ── */}
            <main className="lg:col-span-2 space-y-7">
              {/* Action bar */}
              <div className="print-hide flex flex-wrap gap-2">
                {[
                  {
                    icon: Heart,
                    label: liked ? "Saved" : "Save",
                    action: () => setLiked(!liked),
                    active: liked,
                  },
                  { icon: Printer, label: "Print", action: handlePrint },
                  { icon: Share2, label: "Share", action: handleShare },
                ].map(({ icon: Icon, label, action, active }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-[0.62rem] font-bold transition-all"
                    style={{
                      backgroundColor: active
                        ? "var(--color-orange)"
                        : "var(--color-bg-soft)",
                      color: active ? "#fff" : "var(--color-text)",
                      border: `1px solid ${active ? "var(--color-orange)" : "var(--color-border)"}`,
                    }}
                  >
                    <Icon size={12} /> {label}
                  </button>
                ))}
              </div>

              {/* Description */}
              <p
                className="font-body text-sm leading-relaxed"
                style={{ color: "var(--color-muted)" }}
              >
                {recipe.description}
              </p>

              {/* Quick stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Timer, label: "Total Time", value: recipe.totalTime },
                  {
                    icon: User,
                    label: "Servings",
                    value: `${recipe.servings} people`,
                  },
                  {
                    icon: ChefHat,
                    label: "Difficulty",
                    value: recipe.difficulty,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl p-3 text-center"
                    style={{
                      backgroundColor: "var(--color-bg-soft)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <Icon
                      size={14}
                      className="mx-auto mb-1"
                      style={{ color: "var(--color-orange)" }}
                    />
                    <p
                      className="font-body text-[0.58rem] mb-0.5"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {label}
                    </p>
                    <p
                      className="font-body text-xs font-bold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Ingredients + Directions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div
                  className="rounded-xl p-5"
                  style={{
                    backgroundColor: "var(--color-bg-soft)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "var(--color-orange)" }}
                    >
                      <ChefHat size={13} className="text-white" />
                    </div>
                    <h3
                      className="font-heading font-bold text-sm"
                      style={{ color: "var(--color-text)" }}
                    >
                      Ingredients
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ing, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 font-body text-xs"
                        style={{ color: "var(--color-muted)" }}
                      >
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[0.55rem] flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: "var(--color-orange)" }}
                        >
                          {i + 1}
                        </span>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="rounded-xl p-5"
                  style={{
                    backgroundColor: "var(--color-bg-soft)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "var(--color-orange)" }}
                    >
                      <Utensils size={13} className="text-white" />
                    </div>
                    <h3
                      className="font-heading font-bold text-sm"
                      style={{ color: "var(--color-text)" }}
                    >
                      Directions
                    </h3>
                  </div>
                  <ol className="space-y-3">
                    {recipe.directions.map((step, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 font-body text-xs"
                        style={{ color: "var(--color-muted)" }}
                      >
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[0.55rem] flex-shrink-0 mt-0.5"
                          style={{
                            backgroundColor: "var(--color-orange-dark)",
                          }}
                        >
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Tips + Nutrition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {recipe.tips?.length > 0 && (
                  <div
                    className="rounded-xl p-5"
                    style={{
                      backgroundColor: "rgba(255,127,17,0.06)",
                      border: "1px solid rgba(255,127,17,0.2)",
                    }}
                  >
                    <p
                      className="text-eyebrow mb-1"
                      style={{ color: "var(--color-orange)" }}
                    >
                      Pro Tips
                    </p>
                    <div className="section-rule-orange mb-3" />
                    <ul className="space-y-2">
                      {recipe.tips.map((tip, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 font-body text-xs"
                          style={{ color: "var(--color-muted)" }}
                        >
                          <span
                            className="font-bold"
                            style={{ color: "var(--color-orange)" }}
                          >
                            •
                          </span>{" "}
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div
                  className="rounded-xl p-5"
                  style={{
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <p className="text-eyebrow mb-1" style={{ color: "#16a34a" }}>
                    Nutrition / serving
                  </p>
                  <div
                    className="w-8 h-0.5 mb-3"
                    style={{ backgroundColor: "#16a34a" }}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(recipe.nutrition || {}).map(
                      ([key, val]) => (
                        <div
                          key={key}
                          className="bg-white rounded-lg p-2.5 border border-green-100"
                        >
                          <p
                            className="font-body text-[0.58rem] capitalize mb-0.5"
                            style={{ color: "#6b7280" }}
                          >
                            {key}
                          </p>
                          <p
                            className="font-body text-xs font-bold"
                            style={{ color: "#15803d" }}
                          >
                            {val}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div
                className="pt-5 border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                <p className="text-eyebrow mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="font-body text-[0.62rem] font-semibold px-3 py-1 rounded-full cursor-pointer transition-colors"
                      style={{
                        backgroundColor: "var(--color-bg-soft)",
                        color: "var(--color-muted)",
                        border: "1px solid var(--color-border)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "var(--color-orange)";
                        e.currentTarget.style.color = "var(--color-orange)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "var(--color-border)";
                        e.currentTarget.style.color = "var(--color-muted)";
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </main>

            {/* ── Sidebar ── */}
            <aside className="space-y-5">
              <div
                className="rounded-xl p-5 sticky top-6"
                style={{ border: "1px solid var(--color-border)" }}
              >
                <p className="text-eyebrow mb-1">Quick Summary</p>
                <div className="section-rule-orange mb-4" />
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    ["Prep", recipe.prepTime],
                    ["Cook", recipe.cookTime],
                    ["Total", recipe.totalTime],
                    ["Serves", `${recipe.servings}`],
                    ["Level", recipe.difficulty],
                    ["Rating", `${recipe.rating} ★`],
                  ].map(([label, val]) => (
                    <div
                      key={label}
                      className="rounded-lg p-2.5 text-center"
                      style={{
                        backgroundColor: "var(--color-bg-soft)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <p
                        className="font-body text-[0.55rem] mb-0.5"
                        style={{ color: "var(--color-muted)" }}
                      >
                        {label}
                      </p>
                      <p
                        className="font-body text-xs font-bold"
                        style={{ color: "var(--color-text)" }}
                      >
                        {val}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ── Download PDF button ── */}
                <button
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="btn-secondary w-full flex items-center justify-center gap-2 mb-4"
                  style={{
                    fontSize: "0.6rem",
                    opacity: downloading ? 0.6 : 1,
                    cursor: downloading ? "wait" : "pointer",
                  }}
                >
                  <Download size={12} />
                  {downloading ? "Generating…" : "Download PDF"}
                </button>

                {/* Cooking mode toggle */}
                <div
                  className="flex items-center justify-between pt-4 border-t"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <span
                    className="font-body text-xs font-semibold"
                    style={{ color: "var(--color-text)" }}
                  >
                    Cooking Mode
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={cookingMode}
                      onChange={(e) => setCookingMode(e.target.checked)}
                    />
                    <div
                      className="w-9 h-5 rounded-full transition-colors"
                      style={{
                        backgroundColor: cookingMode
                          ? "var(--color-orange)"
                          : "#d1d5db",
                      }}
                    />
                    <div
                      className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform"
                      style={{
                        transform: cookingMode
                          ? "translateX(16px)"
                          : "translateX(0)",
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Author */}
              <div
                className="rounded-xl p-5"
                style={{ border: "1px solid var(--color-border)" }}
              >
                <p className="text-eyebrow mb-3">Recipe By</p>
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-orange) 0%, var(--color-orange-dark) 100%)",
                    }}
                  >
                    {recipe.author.avatar}
                  </div>
                  <div>
                    <p
                      className="font-body text-sm font-bold mb-1"
                      style={{ color: "var(--color-text)" }}
                    >
                      {recipe.author.name}
                    </p>
                    <p
                      className="font-body text-[0.62rem] leading-relaxed mb-2"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {recipe.author.bio}
                    </p>
                    <p
                      className="font-body text-[0.58rem]"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {recipe.date} · {recipe.views} views
                    </p>
                  </div>
                </div>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div
                  className="rounded-xl p-5"
                  style={{ border: "1px solid var(--color-border)" }}
                >
                  <p className="text-eyebrow mb-3">Related Recipes</p>
                  <div className="space-y-3">
                    {related.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => {
                          navigate(`/recipes/${r.slug}`);
                          window.scrollTo(0, 0);
                        }}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <img
                          src={getImageFromAssets(r.image)}
                          alt={r.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                        />
                        <div>
                          <p
                            className="font-body text-xs font-semibold line-clamp-2 leading-snug mb-1 transition-colors"
                            style={{ color: "var(--color-text)" }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.color =
                                "var(--color-orange)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color =
                                "var(--color-text)")
                            }
                          >
                            {r.title}
                          </p>
                          <span
                            className="flex items-center gap-1 font-body text-[0.58rem]"
                            style={{ color: "var(--color-muted)" }}
                          >
                            <Clock size={10} /> {r.totalTime} ·{" "}
                            <span style={{ color: "var(--color-orange)" }}>
                              ★
                            </span>{" "}
                            {r.rating}
                          </span>
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
    </>
  );
}
