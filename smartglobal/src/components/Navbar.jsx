import React, { useState, useEffect, useRef } from "react";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { assets } from "../assets/assets";

/**
 * SMART GLOBAL - Premium Navigation Bar
 * Features:
 * - Magnetic hover tracking with animated background
 * - Glass morphism effects
 * - Staggered entrance animations
 * - Cart badge with pulse animation
 * - Search overlay with blur backdrop
 * - Floating mega menu on hover
 * - Smooth scroll detection with blur/shadow
 */

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, width: 0 });
  const navRef = useRef(null);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products", hasDropdown: true },
    { name: "Recipes", href: "/recipes" },
    { name: "Blogs", href: "/blogs" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Magnetic hover tracking
  const handleMouseEnter = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const navRect = navRef.current?.getBoundingClientRect();

    setHoveredIndex(index);
    setHoverPosition({
      x: rect.left - (navRect?.left || 0),
      width: rect.width,
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/70 backdrop-blur-2xl shadow-lg border-b border-gray-200/30"
            : "bg-gradient-to-b from-white/90 via-white/80 to-transparent backdrop-blur-sm"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Left */}
            <a href="/" className="group flex items-center gap-3 relative z-10">
              <div className="relative">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-[#BF1A1A] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-full scale-150"></div>

                <img
                  src={assets.logo}
                  alt="Smart Global"
                  className="h-12 w-auto relative z-10 transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                />
              </div>

              <div className="hidden lg:block">
                <div
                  className="text-xl font-black text-gray-900 tracking-tighter transition-all duration-300 group-hover:text-[#BF1A1A] group-hover:tracking-tight"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  SMART GLOBAL
                </div>
                <div className="text-[10px] text-gray-500 font-bold tracking-[0.2em] -mt-1 uppercase">
                  Premium Foods
                </div>
              </div>
            </a>

            {/* Desktop Navigation - Center */}
            <nav
              ref={navRef}
              className="hidden lg:flex items-center relative"
              onMouseLeave={handleMouseLeave}
            >
              {/* Magnetic hover background - Ultra Modern */}
              {hoveredIndex !== null && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-10 rounded-full transition-all duration-300 ease-out"
                  style={{
                    left: `${hoverPosition.x}px`,
                    width: `${hoverPosition.width}px`,
                    background:
                      "linear-gradient(135deg, #BF1A1A 0%, #8B1414 100%)",
                    boxShadow:
                      "0 8px 32px rgba(191, 26, 26, 0.25), inset 0 1px 1px rgba(255,255,255,0.1)",
                  }}
                />
              )}

              <div className="flex items-center gap-1">
                {navLinks.map((link, index) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onMouseEnter={(e) => handleMouseEnter(e, index)}
                    className={`relative px-5 py-2.5 font-bold text-[13px] tracking-wide transition-all duration-300 rounded-full ${
                      hoveredIndex === index
                        ? "text-white scale-105"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      animationDelay: `${index * 50}ms`,
                      animation: "slideDown 0.6s ease-out forwards",
                      opacity: 0,
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-1">
                      {link.name}
                      {link.hasDropdown && (
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-300 ${
                            hoveredIndex === index ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </span>

                    {/* Dot indicator for active/hover */}
                    {hoveredIndex === index && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    )}
                  </a>
                ))}
              </div>
            </nav>

            {/* Right Actions - Ultra Modern Icons */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="group relative p-2.5 rounded-full hover:bg-gray-100/80 transition-all duration-300 hover:scale-110 active:scale-95"
                style={{
                  animation: "slideDown 0.6s ease-out forwards",
                  animationDelay: "400ms",
                  opacity: 0,
                }}
              >
                <Search className="h-5 w-5 text-gray-600 group-hover:text-[#BF1A1A] transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#BF1A1A]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Cart Button - No Badge */}
              <button
                aria-label="Shopping Cart"
                className="group relative p-2.5 rounded-full hover:bg-gray-100/80 transition-all duration-300 hover:scale-110 active:scale-95"
                style={{
                  animation: "slideDown 0.6s ease-out forwards",
                  animationDelay: "450ms",
                  opacity: 0,
                }}
              >
                <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-[#BF1A1A] transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#BF1A1A]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* User Account */}
              <button
                aria-label="User Account"
                className="group relative p-2.5 rounded-full hover:bg-gray-100/80 transition-all duration-300 hover:scale-110 active:scale-95"
                style={{
                  animation: "slideDown 0.6s ease-out forwards",
                  animationDelay: "500ms",
                  opacity: 0,
                }}
              >
                <User className="h-5 w-5 text-gray-600 group-hover:text-[#BF1A1A] transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#BF1A1A]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Modern CTA Button */}
              <a
                href="/contact"
                className="ml-2 px-5 py-2.5 bg-gradient-to-r from-[#BF1A1A] to-[#8B1414] text-white font-bold text-xs rounded-full hover:shadow-lg hover:shadow-[#BF1A1A]/30 transition-all duration-300 hover:scale-105 active:scale-95 uppercase tracking-wider"
                style={{
                  animation: "slideDown 0.6s ease-out forwards",
                  animationDelay: "550ms",
                  opacity: 0,
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Get Started
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
            >
              {mobileOpen ? (
                <X className="h-6 w-6 text-gray-800" />
              ) : (
                <Menu className="h-6 w-6 text-gray-800" />
              )}
            </button>
          </div>

          {/* Inline Search Bar - Slides down from navbar */}
          {searchOpen && (
            <div
              className="overflow-hidden transition-all duration-500 ease-out pb-6"
              style={{
                animation: "expandDown 0.4s ease-out forwards",
              }}
            >
              <div className="relative max-w-2xl">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, recipes, articles..."
                  autoFocus
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                  className="w-full pl-14 pr-6 py-4 text-sm font-semibold rounded-2xl bg-white border border-gray-200 focus:border-[#BF1A1A] focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]/20 transition-all duration-300 shadow-lg"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />

                {/* Quick search tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {["Soups", "Pancake Mixes", "Syrups", "Baby Pouches"].map(
                    (term) => (
                      <button
                        key={term}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-[#BF1A1A] hover:text-white rounded-full text-xs font-bold transition-all duration-300"
                      >
                        {term}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation Panel */}
        {mobileOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
            <nav className="max-w-[1600px] mx-auto px-6 py-6">
              <div className="space-y-1">
                {navLinks.map((link, index) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 font-bold text-sm text-gray-800"
                    style={{
                      animation: "slideRight 0.4s ease-out forwards",
                      animationDelay: `${index * 50}ms`,
                      opacity: 0,
                    }}
                  >
                    <span>{link.name}</span>
                    {link.hasDropdown && (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </a>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center justify-around pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-4 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <Search className="h-6 w-6 text-gray-700" />
                </button>
                <button className="relative p-4 rounded-xl hover:bg-gray-100 transition-all">
                  <ShoppingCart className="h-6 w-6 text-gray-700" />
                </button>
                <button className="p-4 rounded-xl hover:bg-gray-100 transition-all">
                  <User className="h-6 w-6 text-gray-700" />
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-32"></div>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;600;700;800;900&display=swap");

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes expandDown {
          from {
            max-height: 0;
            opacity: 0;
          }
          to {
            max-height: 200px;
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
