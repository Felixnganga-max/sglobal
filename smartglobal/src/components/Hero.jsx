import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Coffee,
  ShoppingBag,
  Star,
  Milk,
  Croissant,
} from "lucide-react";

/**
 * Auto-Rotating Hero Carousel
 * Three distinct creative designs that cycle automatically
 * No manual controls - smooth auto-transition
 */

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      id: 1,
      theme: "coffee",
      bg: "from-amber-50 via-orange-50/30 to-amber-50",
      accentColor: "amber",
    },
    {
      id: 2,
      theme: "milk",
      bg: "from-orange-100 via-red-50 to-orange-100",
      accentColor: "orange",
    },
    {
      id: 3,
      theme: "bakery",
      bg: "from-rose-50 via-pink-50 to-rose-50",
      accentColor: "rose",
    },
  ];

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 300);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${slides[currentSlide].bg} transition-all duration-1000`}
    >
      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div
          className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        >
          {/* Slide 1: Coffee Shop Design */}
          {currentSlide === 0 && <CoffeeSlide />}

          {/* Slide 2: Milk Products Design */}
          {currentSlide === 1 && <MilkSlide />}

          {/* Slide 3: Bakery Design */}
          {currentSlide === 2 && <BakerySlide />}
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-500 ${
              currentSlide === index
                ? "w-8 bg-gradient-to-r from-amber-600 to-orange-600"
                : "w-2 bg-amber-300"
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Pacifico&display=swap");
      `}</style>
    </div>
  );
}

// Coffee Shop Slide Component
function CoffeeSlide() {
  return (
    <section className="relative py-12 lg:py-16 overflow-hidden">
      <div className="relative mx-auto max-w-[1280px] px-6">
        <div className="relative rounded-[32px] bg-white/90 backdrop-blur-sm p-8 lg:p-12 border border-amber-100/50 shadow-[0_20px_80px_rgba(120,53,15,0.08)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Coffee Cups */}
            <div className="relative lg:col-span-6 h-[500px] lg:h-[600px]">
              {/* Large coffee cup - left */}
              <div className="absolute left-0 top-12 w-[280px] h-[380px] transform -rotate-12 hover:rotate-6 transition-all duration-700">
                <div className="relative w-full h-full">
                  {/* Cup body - gradient silver/white */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-white to-gray-100 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                    {/* Black lid */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[85%] h-16 bg-gradient-to-b from-gray-900 to-gray-800 rounded-t-[30px] shadow-lg" />

                    {/* Coffee label badge */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32">
                      <div className="w-full h-full rounded-full border-4 border-amber-500 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center shadow-lg">
                        <div className="text-center">
                          <div className="text-xl font-bold text-amber-400">
                            COFFEE
                          </div>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <div className="w-3 h-4 bg-amber-600 rounded-full" />
                            <div className="w-3 h-4 bg-amber-600 rounded-full" />
                          </div>
                        </div>
                      </div>
                      {/* Decorative dots */}
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/50" />
                    </div>

                    {/* Coffee beans floating */}
                    <div className="absolute top-20 -right-4 w-8 h-10 bg-amber-800 rounded-full rotate-45" />
                    <div className="absolute bottom-24 -left-3 w-7 h-9 bg-amber-900 rounded-full -rotate-12" />
                  </div>
                </div>
              </div>

              {/* Tan/brown coffee cup - center */}
              <div className="absolute left-[35%] top-0 w-[260px] h-[360px] transform rotate-6 hover:-rotate-3 transition-all duration-700 z-10">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
                    {/* Dark lid */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[85%] h-16 bg-gradient-to-b from-amber-900 to-amber-800 rounded-t-[30px]" />

                    {/* Coffee label */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28">
                      <div className="w-full h-full rounded-full border-4 border-amber-900 bg-gradient-to-br from-amber-800 to-amber-900 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold text-amber-200">
                            COFFEE
                          </div>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <div className="w-2.5 h-3.5 bg-amber-300 rounded-full" />
                            <div className="w-2.5 h-3.5 bg-amber-300 rounded-full" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400" />
                    </div>

                    {/* Coffee beans */}
                    <div className="absolute top-16 right-2 w-7 h-9 bg-amber-900 rounded-full rotate-12" />
                    <div className="absolute bottom-32 left-1 w-6 h-8 bg-amber-950 rounded-full -rotate-45" />
                  </div>
                </div>
              </div>

              {/* Price badge */}
              <div className="absolute left-[42%] top-[58%] z-20 animate-float">
                <div
                  className="w-[100px] h-[100px] rounded-full flex items-center justify-center shadow-[0_12px_40px_rgba(245,158,11,0.35)]"
                  style={{
                    background:
                      "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                    border: "3px solid rgba(255,255,255,0.9)",
                  }}
                >
                  <div className="text-center">
                    <div className="text-xs font-medium text-amber-900/80">
                      Start At
                    </div>
                    <div className="text-2xl font-bold text-amber-950">
                      $7.99
                    </div>
                  </div>
                </div>
              </div>

              {/* Small cup bottom right */}
              <div className="absolute right-8 bottom-16 w-[140px] h-[180px] transform rotate-[20deg]">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-red-900 to-rose-950 rounded-[30px] shadow-[0_15px_40px_rgba(0,0,0,0.2)]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[85%] h-12 bg-gradient-to-b from-rose-950 to-rose-900 rounded-t-[20px]" />

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20">
                      <div className="w-full h-full rounded-full border-3 border-amber-500 bg-rose-950 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-sm font-bold text-amber-400">
                            COFFEE
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coffee splash */}
              <div className="absolute right-0 bottom-0 w-[400px] h-[200px]">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <path
                    d="M0 150 Q 50 120, 100 140 T 200 135 T 300 145 T 400 130 L 400 200 L 0 200 Z"
                    fill="url(#coffeeSplash)"
                    className="drop-shadow-2xl"
                  />
                  <defs>
                    <linearGradient
                      id="coffeeSplash"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#78350f" />
                      <stop offset="100%" stopColor="#451a03" />
                    </linearGradient>
                  </defs>
                  {/* Splash droplets */}
                  <circle
                    cx="120"
                    cy="100"
                    r="8"
                    fill="#92400e"
                    opacity="0.6"
                  />
                  <circle cx="180" cy="90" r="6" fill="#92400e" opacity="0.5" />
                  <circle
                    cx="250"
                    cy="95"
                    r="10"
                    fill="#78350f"
                    opacity="0.7"
                  />
                  <circle
                    cx="320"
                    cy="105"
                    r="7"
                    fill="#92400e"
                    opacity="0.5"
                  />
                </svg>
              </div>

              {/* Floating coffee beans */}
              <div className="absolute left-12 top-32 w-6 h-8 bg-amber-900 rounded-full rotate-45 opacity-40" />
              <div className="absolute left-[55%] top-20 w-5 h-7 bg-amber-800 rounded-full -rotate-12 opacity-40" />
            </div>

            {/* Right: Content */}
            <div className="lg:col-span-6 space-y-6">
              <h1
                className="font-serif text-5xl lg:text-7xl leading-tight text-amber-950"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Enjoy Your
                <br />
                <span className="text-amber-800">Morning Coffee</span>
              </h1>

              <p className="text-base text-amber-800/80 max-w-lg leading-relaxed">
                Boost your productivity and build your mood with a glass of
                coffee in the morning, 100% natural from garden.
              </p>

              <button className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-700 to-amber-900 text-white font-medium shadow-lg hover:scale-105 transition-transform">
                Order Now
                <ArrowRight size={20} />
              </button>

              {/* Stats */}
              <div className="flex items-center gap-12 pt-8">
                <div>
                  <div className="text-4xl font-bold text-amber-950">1K+</div>
                  <div className="text-sm text-amber-700">Reviews</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-amber-950">3k+</div>
                  <div className="text-sm text-amber-700">Best Sell</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-amber-950">150+</div>
                  <div className="text-sm text-amber-700">Menu</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Milk Products Slide Component
function MilkSlide() {
  return (
    <section className="relative py-12 lg:py-20 overflow-hidden">
      <div className="relative mx-auto max-w-[1280px] px-6">
        <div
          className="relative rounded-[32px] bg-white backdrop-blur-sm p-8 lg:p-14 shadow-[0_20px_80px_rgba(251,113,133,0.15)] overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #fecaca 0%, #fed7aa 100%)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Milk Cartons with Splash */}
            <div className="relative lg:col-span-6 h-[500px] lg:h-[600px]">
              {/* Milk splash background */}
              <div className="absolute left-0 bottom-0 w-[500px] h-[300px]">
                <svg viewBox="0 0 500 300" className="w-full h-full opacity-90">
                  <path
                    d="M0 200 Q 100 150, 200 180 T 400 170 L 400 300 L 0 300 Z"
                    fill="white"
                    className="drop-shadow-xl"
                  />
                  {/* Splash details */}
                  <path
                    d="M80 180 Q 100 140, 120 180"
                    stroke="white"
                    strokeWidth="40"
                    fill="none"
                    opacity="0.7"
                  />
                  <circle cx="150" cy="150" r="25" fill="white" opacity="0.8" />
                  <circle cx="250" cy="160" r="20" fill="white" opacity="0.7" />
                </svg>
              </div>

              {/* Blue milk carton - left */}
              <div className="absolute left-8 top-16 w-[180px] h-[280px] transform -rotate-12 hover:rotate-0 transition-all duration-700 z-10">
                <div className="relative w-full h-full">
                  {/* Carton shape */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg shadow-[0_20px_60px_rgba(14,165,233,0.3)]"
                    style={{
                      clipPath:
                        "polygon(10% 0%, 90% 0%, 100% 8%, 100% 100%, 0% 100%, 0% 8%)",
                    }}
                  >
                    {/* Cap */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-sm shadow-md" />

                    {/* Label */}
                    <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[85%] text-center">
                      <div
                        className="text-3xl font-bold text-white mb-2"
                        style={{ fontFamily: "'Pacifico', cursive" }}
                      >
                        MilkCow
                      </div>
                      <div className="text-xs text-white/90">
                        100% Fresh Milk
                      </div>

                      {/* Cow illustration placeholder */}
                      <div className="mt-4 flex justify-center">
                        <div className="w-20 h-16 bg-white/30 rounded-lg flex items-center justify-center">
                          <Milk size={32} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mint/green milk carton - right */}
              <div className="absolute right-16 top-8 w-[200px] h-[300px] transform rotate-12 hover:rotate-6 transition-all duration-700 z-10">
                <div className="relative w-full h-full">
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-emerald-300 to-emerald-500 rounded-lg shadow-[0_20px_60px_rgba(16,185,129,0.3)]"
                    style={{
                      clipPath:
                        "polygon(10% 0%, 90% 0%, 100% 8%, 100% 100%, 0% 100%, 0% 8%)",
                    }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-sm shadow-md" />

                    <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[85%] text-center">
                      <div
                        className="text-3xl font-bold text-white mb-2"
                        style={{ fontFamily: "'Pacifico', cursive" }}
                      >
                        MilkCow
                      </div>
                      <div className="text-xs text-white/90">Farm to Table</div>

                      <div className="mt-4 flex justify-center">
                        <div className="w-20 h-16 bg-white/30 rounded-lg flex items-center justify-center">
                          <Milk size={32} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cows at bottom */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                <div className="w-24 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <div className="text-4xl">🐄</div>
                </div>
                <div className="w-20 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center opacity-80">
                  <div className="text-3xl">🐄</div>
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="lg:col-span-6 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-white">
                <Star size={16} className="text-orange-500 fill-orange-500" />
                <span className="text-sm font-medium text-orange-900">
                  100% Pure & Fresh
                </span>
              </div>

              <h1 className="text-5xl lg:text-8xl font-bold text-white leading-tight">
                Fresh milk
                <br />
                for all!
              </h1>

              <p
                className="text-2xl text-white/90 italic"
                style={{ fontFamily: "'Pacifico', cursive" }}
              >
                from molly with mooo!
              </p>

              <button className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-orange-600 font-bold text-lg shadow-xl hover:scale-105 transition-transform">
                Buy now
              </button>

              {/* Product info */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">100%</div>
                  <div className="text-sm text-white/80">Natural</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">Fresh</div>
                  <div className="text-sm text-white/80">Daily</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">A++</div>
                  <div className="text-sm text-white/80">Quality</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Bakery/Pastry Slide Component
function BakerySlide() {
  return (
    <section className="relative py-12 lg:py-20 overflow-hidden">
      <div className="relative mx-auto max-w-[1280px] px-6">
        <div className="relative rounded-[32px] bg-gradient-to-br from-rose-50 to-pink-50 backdrop-blur-sm p-8 lg:p-14 border border-rose-100/50 shadow-[0_20px_80px_rgba(225,29,72,0.1)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Bakery Items */}
            <div className="relative lg:col-span-6 h-[500px] lg:h-[600px]">
              {/* Croissant - main */}
              <div className="absolute left-8 top-12 w-[320px] h-[280px] transform -rotate-12 hover:rotate-0 transition-all duration-700">
                <img
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80"
                  alt="Fresh croissants"
                  className="w-full h-full object-cover rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
                />
              </div>

              {/* Coffee cup with pastry */}
              <div className="absolute right-12 top-16 w-[280px] h-[320px] transform rotate-12 hover:rotate-6 transition-all duration-700 z-10">
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80"
                  alt="Coffee and pastries"
                  className="w-full h-full object-cover rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                />
              </div>

              {/* Price badge */}
              <div className="absolute left-[40%] top-[55%] z-20 animate-float">
                <div
                  className="w-[110px] h-[110px] rounded-full flex items-center justify-center shadow-[0_12px_40px_rgba(236,72,153,0.35)]"
                  style={{
                    background:
                      "linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%)",
                    border: "4px solid rgba(255,255,255,0.9)",
                  }}
                >
                  <div className="text-center">
                    <div className="text-xs font-medium text-rose-900/80">
                      From
                    </div>
                    <div className="text-2xl font-bold text-rose-950">
                      $4.50
                    </div>
                  </div>
                </div>
              </div>

              {/* Donut accent */}
              <div className="absolute right-8 bottom-20 w-[140px] h-[140px] transform rotate-[25deg]">
                <img
                  src="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80"
                  alt="Donuts"
                  className="w-full h-full object-cover rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
                />
              </div>

              {/* Decorative elements */}
              <div
                className="absolute left-16 bottom-24 text-6xl animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                🥐
              </div>
              <div
                className="absolute right-32 bottom-32 text-5xl opacity-70"
                style={{ animation: "float 4s ease-in-out infinite" }}
              >
                ☕
              </div>
            </div>

            {/* Right: Content */}
            <div className="lg:col-span-6 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-200/50">
                <Croissant size={16} className="text-rose-600" />
                <span className="text-sm font-medium text-rose-900">
                  Freshly Baked Daily
                </span>
              </div>

              <h1
                className="font-serif text-5xl lg:text-7xl leading-tight text-rose-950"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Sweet Treats
                <br />
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  For Your Day
                </span>
              </h1>

              <p className="text-base text-rose-900/70 leading-relaxed max-w-lg">
                Indulge in our artisan pastries and baked goods, crafted with
                love every morning. From flaky croissants to rich coffee, start
                your day deliciously.
              </p>

              <button className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium shadow-lg hover:scale-105 transition-transform">
                Order Now
                <ArrowRight size={20} />
              </button>

              {/* Stats */}
              <div className="flex items-center gap-12 pt-8">
                <div>
                  <div className="text-4xl font-bold text-rose-950">50+</div>
                  <div className="text-sm text-rose-700">Varieties</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-rose-950">2K+</div>
                  <div className="text-sm text-rose-700">Daily Orders</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-rose-950">5★</div>
                  <div className="text-sm text-rose-700">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
