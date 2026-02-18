import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("next");

  const slides = [
    { id: 1, name: "toppings" },
    { id: 2, name: "spuds" },
    { id: 3, name: "water" },
    { id: 4, name: "spices" },
  ];

  const changeSlide = useCallback(
    (index, dir = "next") => {
      if (isTransitioning) return;
      setDirection(dir);
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 450);
    },
    [isTransitioning],
  );

  const next = useCallback(() => {
    changeSlide((currentSlide + 1) % slides.length, "next");
  }, [currentSlide, slides.length, changeSlide]);

  const prev = useCallback(() => {
    changeSlide((currentSlide - 1 + slides.length) % slides.length, "prev");
  }, [currentSlide, slides.length, changeSlide]);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="w-full relative overflow-hidden bg-gray-950">
      {/* Slide Content */}
      <div
        className={`transition-all duration-450 ease-in-out ${
          isTransitioning
            ? direction === "next"
              ? "opacity-0 translate-x-8"
              : "opacity-0 -translate-x-8"
            : "opacity-100 translate-x-0"
        }`}
        style={{ transition: "opacity 0.45s ease, transform 0.45s ease" }}
      >
        {currentSlide === 0 && <ToppingsSlide />}
        {currentSlide === 1 && <SpudsSlide />}
        {currentSlide === 2 && <WaterSlide />}
        {currentSlide === 3 && <SpicesSlide />}
      </div>

      {/* ── Arrow Navigation ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 group"
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 group-hover:border-white/40 transition-all duration-300 group-hover:scale-110 shadow-xl">
          <svg
            className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>
      </button>

      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 group"
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 group-hover:border-white/40 transition-all duration-300 group-hover:scale-110 shadow-xl">
          <svg
            className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </button>

      {/* ── Dot Navigation ── */}
      <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-40">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() =>
              changeSlide(index, index > currentSlide ? "next" : "prev")
            }
            aria-label={`Go to ${slide.name} slide`}
            className={`rounded-full transition-all duration-400 ${
              currentSlide === index
                ? "w-8 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Shared Arrow SVG ─── */
function ArrowRight() {
  return (
    <svg
      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  );
}

/* ════════════════════════════════════════
   SLIDE 1 — Kent Toppings
════════════════════════════════════════ */
function ToppingsSlide() {
  return (
    <section className="relative w-full min-h-[88vh] sm:min-h-screen flex items-center overflow-hidden bg-[#1a1008]">
      {/* Background image layer */}
      <div className="absolute inset-0">
        <img
          src={assets.recipe}
          alt=""
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1008]/95 via-[#1a1008]/70 to-transparent" />
      </div>

      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 min-h-[88vh] sm:min-h-screen">
        {/* Left — Text */}
        <div className="flex flex-col justify-center page-x py-16 sm:py-20 lg:py-24 order-2 lg:order-1">
          <p className="text-eyebrow mb-4" style={{ color: "#FF7F11" }}>
            Kent Boringer · Toppings
          </p>

          <h1
            className="font-heading text-white leading-[1.05] mb-5"
            style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", fontWeight: 700 }}
          >
            Elevate Your
            <br />
            <span style={{ color: "#FF7F11" }}>Sweet Moments</span>
          </h1>

          <p className="font-body text-white/70 text-sm sm:text-base leading-relaxed max-w-md mb-8">
            Transform ordinary desserts into extraordinary experiences. From
            rich raspberry to luscious caramel — every drop adds magic.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 btn-primary text-xs"
            >
              Shop Toppings <ArrowRight />
            </Link>
            <Link
              to="/recipes"
              className="group inline-flex items-center gap-2 btn-outline text-xs"
              style={{ color: "white", borderColor: "rgba(255,255,255,0.35)" }}
            >
              View Recipes <ArrowRight />
            </Link>
          </div>
        </div>

        {/* Right — Images */}
        <div className="relative order-1 lg:order-2 h-[45vw] sm:h-[55vw] lg:h-auto overflow-hidden">
          {/* Main large image */}
          <div className="absolute right-0 top-0 h-full w-[75%] lg:w-full">
            <img
              src={assets.topping}
              alt="Kent Toppings"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#1a1008]/80 lg:to-[#1a1008]/40" />
          </div>
          {/* Floating accent */}
          <div className="absolute bottom-8 left-8 w-24 sm:w-32 h-24 sm:h-32 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 rotate-6">
            <img
              src={assets.top2}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-8 left-16 w-16 sm:w-20 h-16 sm:h-20 rounded-xl overflow-hidden shadow-xl border-2 border-white/15 -rotate-8 opacity-80">
            <img
              src={assets.top1}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   SLIDE 2 — SPUDS
════════════════════════════════════════ */
function SpudsSlide() {
  return (
    <section className="relative w-full min-h-[88vh] sm:min-h-screen flex items-center overflow-hidden bg-[#0f0a00]">
      {/* Full bleed bg */}
      <div className="absolute inset-0">
        <img
          src={assets.spuds3}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0a00]/98 via-[#0f0a00]/75 to-[#0f0a00]/20" />
      </div>

      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 min-h-[88vh] sm:min-h-screen">
        {/* Left — Text */}
        <div className="flex flex-col justify-center page-x py-16 sm:py-20 lg:py-24 order-2 lg:order-1">
          <p className="text-eyebrow mb-4">Spuds · Craft Crisps</p>

          <h1
            className="font-heading text-white leading-[1.05] mb-5"
            style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", fontWeight: 700 }}
          >
            Crunch Into
            <br />
            <span style={{ color: "#FF0000" }}>Bold Flavor</span>
          </h1>

          <p className="font-body text-white/70 text-sm sm:text-base leading-relaxed max-w-md mb-8">
            9 unique flavor profiles. Hand-selected potatoes, expertly seasoned,
            perfectly crispy. Snacking — elevated.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
              style={{
                background: "#FF0000",
                color: "white",
                boxShadow: "0 4px 20px rgba(255,0,0,0.4)",
              }}
            >
              Order Now <ArrowRight />
            </Link>
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full border transition-all duration-300"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}
            >
              Our Story <ArrowRight />
            </Link>
          </div>
        </div>

        {/* Right — Stacked product images */}
        <div className="relative order-1 lg:order-2 h-[45vw] sm:h-[55vw] lg:h-auto overflow-hidden">
          {/* Main */}
          <div className="absolute right-0 top-0 h-full w-[80%] lg:w-full">
            <img
              src={assets.spuds}
              alt="SPUDS Crisps"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0f0a00]/85 lg:to-[#0f0a00]/50" />
          </div>
          {/* Floating packs */}
          <div className="absolute bottom-10 left-6 w-20 sm:w-28 h-20 sm:h-28 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/15 -rotate-6">
            <img
              src={assets.spuds2}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-10 left-14 w-14 sm:w-18 h-14 sm:h-18 rounded-xl overflow-hidden shadow-xl border border-white/10 rotate-10 opacity-75">
            <img
              src={assets.spuds4}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   SLIDE 3 — Kizembe Water
════════════════════════════════════════ */
function WaterSlide() {
  return (
    <section className="relative w-full min-h-[88vh] sm:min-h-screen flex items-center overflow-hidden bg-[#021826]">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={assets.kizembe}
          alt=""
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#021826]/98 via-[#021826]/75 to-[#021826]/20" />
      </div>

      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 min-h-[88vh] sm:min-h-screen">
        {/* Left — Text */}
        <div className="flex flex-col justify-center page-x py-16 sm:py-20 lg:py-24 order-2 lg:order-1">
          <p className="text-eyebrow mb-4" style={{ color: "#1E88E5" }}>
            Kizembe · Spring Water
          </p>

          <h1
            className="font-heading text-white leading-[1.05] mb-5"
            style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", fontWeight: 700 }}
          >
            Drink Bold.
            <br />
            <span style={{ color: "#1E88E5" }}>Live Fresh.</span>
          </h1>

          <p className="font-body text-white/70 text-sm sm:text-base leading-relaxed max-w-md mb-8">
            Sourced from the pristine natural springs of Limuru. Pure, naturally
            filtered, perfectly balanced — available in 6 sizes.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
              style={{
                background: "#1565C0",
                color: "white",
                boxShadow: "0 4px 20px rgba(21,101,192,0.45)",
              }}
            >
              Find Near You <ArrowRight />
            </Link>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full border transition-all duration-300"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}
            >
              Contact Us <ArrowRight />
            </Link>
          </div>
        </div>

        {/* Right — image */}
        <div className="relative order-1 lg:order-2 h-[45vw] sm:h-[55vw] lg:h-auto overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-[75%] lg:w-full">
            <img
              src={assets.kizembe}
              alt="Kizembe Water"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#021826]/85 lg:to-[#021826]/50" />
          </div>
          {/* Floating accent */}
          <div className="absolute bottom-10 left-8 w-20 sm:w-28 h-20 sm:h-28 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/15 rotate-6">
            <img
              src={assets.crepes}
              alt=""
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   SLIDE 4 — Kent Soups / Spices
════════════════════════════════════════ */
function SpicesSlide() {
  return (
    <section className="relative w-full min-h-[88vh] sm:min-h-screen flex items-center overflow-hidden bg-[#0e1409]">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={assets.kent}
          alt=""
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e1409]/98 via-[#0e1409]/75 to-[#0e1409]/15" />
      </div>

      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 min-h-[88vh] sm:min-h-screen">
        {/* Left — Text */}
        <div className="flex flex-col justify-center page-x py-16 sm:py-20 lg:py-24 order-2 lg:order-1">
          <p className="text-eyebrow mb-4" style={{ color: "#FF7F11" }}>
            Kent Boringer · Soups & Seasonings
          </p>

          <h1
            className="font-heading text-white leading-[1.05] mb-5"
            style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", fontWeight: 700 }}
          >
            Taste The
            <br />
            <span style={{ color: "#FF7F11" }}>Goodness</span>
          </h1>

          <p className="font-body text-white/70 text-sm sm:text-base leading-relaxed max-w-md mb-8">
            Premium soups and seasonings crafted from 100% natural vegetables.
            Rich flavor, wholesome nutrition — ready in minutes.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
              style={{
                background: "#FF7F11",
                color: "white",
                boxShadow: "0 4px 20px rgba(255,127,17,0.45)",
              }}
            >
              Shop Now <ArrowRight />
            </Link>
            <Link
              to="/recipes"
              className="group inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full border transition-all duration-300"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}
            >
              View Recipes <ArrowRight />
            </Link>
          </div>
        </div>

        {/* Right — images */}
        <div className="relative order-1 lg:order-2 h-[45vw] sm:h-[55vw] lg:h-auto overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-[75%] lg:w-full">
            <img
              src={assets.kent}
              alt="Kent Soups"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0e1409]/85 lg:to-[#0e1409]/50" />
          </div>
          {/* Floating accent images */}
          <div className="absolute bottom-8 left-6 w-20 sm:w-28 h-20 sm:h-28 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/15 -rotate-5">
            <img
              src={assets.noodle}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-10 left-14 w-14 sm:w-20 h-14 sm:h-20 rounded-xl overflow-hidden shadow-xl border border-white/10 rotate-8 opacity-75">
            <img
              src={assets.top3}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
