import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

/**
 * Premium Product Hero Carousel - 4 Categories
 * Kent Toppings | SPUDS Chips | Kizembe Water | Kent Spices
 * Enhanced width, authority, and mobile-perfect design
 */

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    { id: 1, name: "toppings" },
    { id: 2, name: "spuds" },
    { id: 3, name: "water" },
    { id: 4, name: "spices" },
  ];

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 400);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Manual navigation
  const goToSlide = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Carousel Container */}
      <div className="relative w-full overflow-hidden">
        <div
          className={`transition-all duration-400 ${
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          {currentSlide === 0 && <ToppingsSlide />}
          {currentSlide === 1 && <SpudsSlide />}
          {currentSlide === 2 && <WaterSlide />}
          {currentSlide === 3 && <SpicesSlide />}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? "w-12 h-3 bg-[#BF1A1A]"
                  : "w-3 h-3 bg-gray-400 hover:bg-gray-600"
              }`}
              aria-label={`Go to ${slide.name} slide`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap");

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(191, 26, 26, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(191, 26, 26, 0.8);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// 1. Kent Toppings Slide - Premium Ice Cream & Dessert Toppings
function ToppingsSlide() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center py-12 lg:py-20 overflow-hidden bg-[#EBE1D1]">
      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="relative rounded-3xl bg-white p-8 lg:p-12 border-2 border-[#FFD41D] shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Product Images */}
            <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] order-1 lg:order-1">
              {/* Large topping - left */}
              <div className="absolute left-0 top-8 w-[220px] sm:w-[280px] lg:w-[320px] h-[280px] sm:h-[360px] lg:h-[420px] transform -rotate-12 hover:rotate-0 transition-all duration-700">
                <img
                  src={assets.topping}
                  alt="Kent Topping"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white"
                />
              </div>

              {/* Center topping */}
              <div className="absolute left-[35%] top-0 w-[200px] sm:w-[260px] lg:w-[300px] h-[260px] sm:h-[340px] lg:h-[400px] transform rotate-8 hover:rotate-3 transition-all duration-700 z-10">
                <img
                  src={assets.top2}
                  alt="Kent Product"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-[#FFD41D]"
                />
              </div>

              {/* Small product bottom right */}
              <div className="absolute right-8 bottom-12 w-[120px] sm:w-[140px] lg:w-[160px] h-[150px] sm:h-[180px] lg:h-[200px] transform rotate-[20deg]">
                <img
                  src={assets.kent}
                  alt="Kent Soup"
                  className="w-full h-full object-cover rounded-2xl shadow-xl border-4 border-[#BF1A1A]"
                />
              </div>

              {/* Additional accent */}
              <div className="absolute right-0 bottom-0 w-[280px] sm:w-[340px] lg:w-[380px] h-[150px] sm:w-[180px] lg:h-[200px]">
                <img
                  src={assets.top}
                  alt="Product accent"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>

              {/* Small floating products */}
              <div className="absolute left-12 top-28">
                <img
                  src={assets.top3}
                  alt="Product"
                  className="w-10 h-10 rounded-full object-cover rotate-45 opacity-70"
                />
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-6 lg:space-y-8 order-2 lg:order-2 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white shadow-lg border-2 border-[#FFD41D]">
                <div className="w-2 h-2 bg-[#BF1A1A] rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-800 tracking-wide">
                  PREMIUM DESSERT TOPPINGS
                </span>
              </div>

              {/* Heading */}
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] text-gray-900"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                <span className="block">ELEVATE YOUR</span>
                <span className="block text-[#BF1A1A]">SWEET MOMENTS</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Transform ordinary desserts into extraordinary experiences with
                Kent Boringer's premium toppings. From rich raspberry to
                luscious caramel, every drop adds magic.
              </p>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button className="group px-10 py-5 rounded-full bg-[#BF1A1A] text-white font-bold text-lg shadow-2xl hover:bg-[#8B1414] transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(191,26,26,0.4)]">
                  <span className="flex items-center gap-3 justify-center">
                    Shop Toppings
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>
                <button className="px-10 py-5 rounded-full bg-white text-gray-900 font-bold text-lg shadow-xl hover:shadow-2xl border-2 border-gray-200 hover:border-[#FFD41D] transition-all duration-300">
                  View Flavors
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-black text-[#BF1A1A]">
                    15+
                  </div>
                  <div className="text-sm text-gray-600 font-semibold mt-1">
                    Flavors
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-black text-[#BF1A1A]">
                    100%
                  </div>
                  <div className="text-sm text-gray-600 font-semibold mt-1">
                    Natural
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-black text-[#BF1A1A]">
                    5★
                  </div>
                  <div className="text-sm text-gray-600 font-semibold mt-1">
                    Rated
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 2. SPUDS Chips Slide - Premium Craft-Cooked Potato Chips
function SpudsSlide() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center py-12 lg:py-20 overflow-hidden bg-[#8B1414]">
      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="relative rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden bg-[#BF1A1A]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Product Showcase */}
            <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] order-1">
              {/* Background accent */}
              <div className="absolute left-0 bottom-0 w-full h-[280px]">
                <img
                  src={assets.spuds1}
                  alt="Product splash"
                  className="w-full h-full object-cover opacity-30 rounded-2xl"
                />
              </div>

              {/* Main Product - SPUDS */}
              <div className="absolute left-8 top-12 w-[240px] sm:w-[300px] lg:w-[360px] h-[280px] sm:h-[350px] lg:h-[420px] transform -rotate-12 hover:rotate-0 transition-all duration-700 z-10">
                <img
                  src={assets.spuds}
                  alt="SPUDS Chips"
                  className="w-full h-full object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
                />
              </div>

              {/* Secondary product */}
              <div className="absolute right-12 top-4 w-[220px] sm:w-[280px] lg:w-[320px] h-[260px] sm:h-[320px] lg:h-[380px] transform rotate-12 hover:rotate-6 transition-all duration-700 z-10">
                <img
                  src={assets.spuds2}
                  alt="SPUDS Product"
                  className="w-full h-full object-cover rounded-xl shadow-2xl border-4 border-[#FFD41D]"
                />
              </div>

              {/* Bottom accent products */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                <img
                  src={assets.spuds3}
                  alt="Product"
                  className="w-24 h-24 rounded-2xl object-cover shadow-xl border-4 border-white"
                />
                <img
                  src={assets.spuds4}
                  alt="Product"
                  className="w-20 h-20 rounded-2xl object-cover shadow-xl border-4 border-white opacity-90"
                />
              </div>

              {/* Small floating product */}
              <div className="absolute left-4 top-32">
                <img
                  src={assets.spuds5}
                  alt="Product"
                  className="w-16 h-16 rounded-full object-cover opacity-50"
                />
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-6 lg:space-y-8 order-2 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-100 shadow-lg border-2 border-amber-300">
                <div className="w-2 h-2 bg-red-800 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-red-900 tracking-wide uppercase">
                  Craft Cooked Perfection
                </span>
              </div>

              {/* Heading */}
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] text-white"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                <span className="block">CRUNCH INTO</span>
                <span className="block text-[#FFD41D]">BOLD FLAVOR</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg lg:text-xl text-amber-100 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Experience the ultimate crunch with SPUDS craft-cooked potato
                chips. Hand-selected potatoes, expertly seasoned, perfectly
                crispy. Snacking elevated.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button className="group px-10 py-5 rounded-full bg-[#FFD41D] text-red-900 font-black text-lg shadow-2xl hover:bg-amber-300 transition-all duration-300 hover:scale-105">
                  <span className="flex items-center gap-3 justify-center">
                    Order Now
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>
                <button className="px-10 py-5 rounded-full bg-transparent text-white font-bold text-lg border-3 border-white hover:bg-white hover:text-red-900 transition-all duration-300">
                  All Flavors
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-6 pt-8 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-black text-[#FFD41D]">
                    100%
                  </div>
                  <div className="text-sm text-amber-200 font-semibold mt-1">
                    Real Potato
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-black text-[#FFD41D]">
                    Zero
                  </div>
                  <div className="text-sm text-amber-200 font-semibold mt-1">
                    Trans Fat
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-black text-[#FFD41D]">
                    Halal
                  </div>
                  <div className="text-sm text-amber-200 font-semibold mt-1">
                    Certified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 3. Kizembe Water Slide - Pure Natural Spring Water
function WaterSlide() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center py-12 lg:py-20 overflow-hidden bg-[#EBE1D1]">
      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="relative rounded-3xl bg-white p-8 lg:p-12 border-2 border-[#00A8E8] shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Product Images */}
            <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] order-1 lg:order-1">
              {/* Background splash */}
              <div className="absolute left-0 bottom-0 w-full h-[280px]">
                <img
                  src={assets.crepes}
                  alt="Water splash"
                  className="w-full h-full object-cover opacity-20 rounded-2xl"
                />
              </div>

              {/* Main water bottle - left */}
              <div className="absolute left-8 top-12 w-[200px] sm:w-[250px] lg:w-[300px] h-[280px] sm:h-[350px] lg:h-[420px] transform -rotate-12 hover:rotate-0 transition-all duration-700 z-10">
                <img
                  src={assets.spuds1}
                  alt="Kizembe Water"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>

              {/* Secondary bottle - right */}
              <div className="absolute right-12 top-4 w-[220px] sm:w-[270px] lg:w-[320px] h-[300px] sm:h-[370px] lg:h-[440px] transform rotate-12 hover:rotate-6 transition-all duration-700 z-10">
                <img
                  src={assets.noodle}
                  alt="Kizembe Water Bottle"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>

              {/* Bottom accent products */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                <img
                  src={assets.hazelnut}
                  alt="Product"
                  className="w-24 h-24 rounded-2xl object-cover shadow-xl border-4 border-white"
                />
                <img
                  src={assets.top1}
                  alt="Product"
                  className="w-20 h-20 rounded-2xl object-cover shadow-xl border-4 border-white opacity-90"
                />
              </div>

              {/* Small floating element */}
              <div className="absolute left-4 top-32">
                <img
                  src={assets.top3}
                  alt="Accent"
                  className="w-16 h-16 rounded-full object-cover opacity-50"
                />
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-6 lg:space-y-8 order-2 lg:order-2 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white shadow-lg border-2 border-[#00A8E8]">
                <div className="w-2 h-2 bg-[#0077B6] rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-[#0077B6] tracking-wide uppercase">
                  100% Natural Spring Water
                </span>
              </div>

              {/* Heading */}
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.05] text-black"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                <span className="block">DRINK BOLD.</span>
                <span className="block text-[#0077B6]">LIVE FRESH.</span>
              </h1>

              {/* Tagline */}
              <p
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#00A8E8] italic"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Kizembe Water
              </p>

              {/* Description */}
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Sourced from pristine natural springs, Kizembe delivers pure
                refreshment in every sip. Naturally filtered, perfectly
                balanced, 100% guaranteed fresh.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button className="group px-10 py-5 rounded-full bg-[#0077B6] text-white font-black text-lg shadow-2xl hover:bg-[#005A8C] transition-all duration-300 hover:scale-105">
                  <span className="flex items-center gap-3 justify-center">
                    Find Near You
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>
                <button className="px-10 py-5 rounded-full bg-white text-gray-900 font-bold text-lg shadow-xl hover:shadow-2xl border-2 border-gray-200 hover:border-[#00A8E8] transition-all duration-300">
                  Learn More
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-8 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-black text-[#0077B6]">
                    100%
                  </div>
                  <div className="text-sm text-gray-600 font-semibold mt-1">
                    Guaranteed
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-black text-[#0077B6]">
                    Pure
                  </div>
                  <div className="text-sm text-gray-600 font-semibold mt-1">
                    Natural
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-black text-[#0077B6]">
                    Fresh
                  </div>
                  <div className="text-sm text-gray-600 font-semibold mt-1">
                    Daily
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 4. Kent Spices Slide - Premium Soup & Seasoning Mixes
function SpicesSlide() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center py-12 lg:py-20 overflow-hidden bg-[#EBE1D1]">
      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="relative rounded-3xl bg-white p-8 lg:p-12 border-2 border-[#4CAF50] shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Product Showcase */}
            <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] order-1">
              {/* Main Product - Vegetable Soup */}
              <div className="absolute left-8 top-8 w-[260px] sm:w-[320px] lg:w-[380px] h-[340px] sm:h-[420px] lg:h-[500px] transform -rotate-12 hover:rotate-0 transition-all duration-700">
                <img
                  src={assets.kent}
                  alt="Kent Vegetable Soup"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-[#FFD41D]"
                />
              </div>

              {/* Secondary product */}
              <div className="absolute right-12 top-12 w-[240px] sm:w-[300px] lg:w-[340px] h-[300px] sm:h-[370px] lg:h-[430px] transform rotate-12 hover:rotate-6 transition-all duration-700 z-10">
                <img
                  src={assets.topping}
                  alt="Kent Product"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white"
                />
              </div>

              {/* Accent product */}
              <div className="absolute right-8 bottom-16 w-[120px] sm:w-[140px] lg:w-[160px] h-[120px] sm:h-[140px] lg:h-[160px] transform rotate-[25deg]">
                <img
                  src={assets.top2}
                  alt="Product"
                  className="w-full h-full object-cover rounded-2xl shadow-xl border-4 border-[#4CAF50]"
                />
              </div>

              {/* Additional products */}
              <div className="absolute left-12 bottom-20 w-24 h-24">
                <img
                  src={assets.top3}
                  alt="Product"
                  className="w-full h-full object-cover rounded-xl shadow-lg border-2 border-white"
                />
              </div>

              {/* Small accent */}
              <div className="absolute right-32 bottom-28 w-20 h-20 opacity-70">
                <img
                  src={assets.top1}
                  alt="Product"
                  className="w-full h-full object-cover rounded-full shadow-lg"
                />
              </div>

              {/* Floating element */}
              <div className="absolute left-16 top-32">
                <img
                  src={assets.spuds}
                  alt="Accent"
                  className="w-12 h-12 rounded-full object-cover opacity-50"
                />
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-6 lg:space-y-8 order-2 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E8F5E9] shadow-lg border-2 border-[#4CAF50]">
                <div className="w-2 h-2 bg-[#2E7D32] rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-[#2E7D32] tracking-wide uppercase">
                  100% Natural Ingredients
                </span>
              </div>

              {/* Heading */}
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] text-black"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                <span className="block">TASTE THE</span>
                <span className="block text-[#4CAF50]">GOODNESS</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Kent Boringer brings you premium soups and seasonings crafted
                from 100% natural vegetables. Rich flavor, wholesome nutrition,
                ready in minutes.
              </p>

              {/* Halal Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#E8F5E9] border-2 border-[#4CAF50]">
                <div className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">✓</span>
                </div>
                <span className="text-[#2E7D32] font-bold text-lg">
                  Halal Certified
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button className="group px-10 py-5 rounded-full bg-[#4CAF50] text-white font-black text-lg shadow-2xl hover:bg-[#2E7D32] transition-all duration-300 hover:scale-105">
                  <span className="flex items-center gap-3 justify-center">
                    Shop Now
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>
                <button className="px-10 py-5 rounded-full bg-white text-gray-900 font-bold text-lg shadow-xl hover:shadow-2xl border-2 border-gray-200 hover:border-[#4CAF50] transition-all duration-300">
                  View Recipes
                </button>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-3 gap-6 pt-8 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-black text-[#4CAF50]">
                    4
                  </div>
                  <div className="text-sm text-gray-600 font-semibold mt-1">
                    Servings
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-black text-[#4CAF50]">
                    100%
                  </div>
                  <div className="text-sm text-gray-600 font-semibold mt-1">
                    Vegetables
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-black text-[#4CAF50]">
                    5min
                  </div>
                  <div className="text-sm text-gray-600 font-semibold mt-1">
                    Ready
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
