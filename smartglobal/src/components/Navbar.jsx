import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  History,
  UserCircle,
  LogOut,
} from "lucide-react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cartcontext";

export default function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, width: 0 });
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setUserDropdownOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Products", href: "/products", hasDropdown: true },
    { name: "Recipes", href: "/recipes" },
    { name: "Blogs", href: "/blogs" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setUserDropdownOpen(false);
    };
    if (userDropdownOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdownOpen]);

  // Auto-focus search input when it opens
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchOpen]);

  const handleMouseEnter = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const navRect = navRef.current?.getBoundingClientRect();
    setHoveredIndex(index);
    setHoverPosition({
      x: rect.left - (navRect?.left || 0),
      width: rect.width,
    });
  };

  /* ── Search: push ?q= to URL so Sales.jsx can read it ── */
  const submitSearch = (term) => {
    const q = (term ?? searchQuery).trim();
    setSearchOpen(false);
    setMobileOpen(false);
    setSearchQuery("");
    navigate(q ? `/?q=${encodeURIComponent(q)}` : "/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    submitSearch();
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
            {/* Logo */}
            <a href="/" className="group flex items-center gap-3 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-full scale-150 bg-red"></div>
                <img
                  src={assets.logo}
                  alt="Smart Global"
                  className="h-12 w-auto relative z-10 transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                />
              </div>
              <div className="hidden lg:block">
                <div className="font-heading text-xl font-black text-gray-900 tracking-tighter transition-all duration-300 group-hover:text-red">
                  SMART GLOBAL
                </div>
                <div
                  className="text-label text-gray-500 -mt-1"
                  style={{ fontSize: "0.6rem", letterSpacing: "0.2em" }}
                >
                  Premium Foods
                </div>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav
              ref={navRef}
              className="hidden lg:flex items-center relative"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {hoveredIndex !== null && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-10 rounded-full bg-red transition-all duration-300 ease-out"
                  style={{
                    left: `${hoverPosition.x}px`,
                    width: `${hoverPosition.width}px`,
                    boxShadow: "0 8px 32px rgba(255,0,0,0.25)",
                  }}
                />
              )}
              <div className="flex items-center gap-1">
                {navLinks.map((link, index) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onMouseEnter={(e) => handleMouseEnter(e, index)}
                    className={`relative px-5 py-2.5 font-body font-bold text-[13px] tracking-wide transition-all duration-300 rounded-full ${
                      hoveredIndex === index
                        ? "text-white scale-105"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: "slideDown 0.6s ease-out forwards",
                      opacity: 0,
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-1">
                      {link.name}
                      {link.hasDropdown && (
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-300 ${hoveredIndex === index ? "rotate-180" : ""}`}
                        />
                      )}
                    </span>
                  </a>
                ))}
              </div>
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Search"
                className={`group relative p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
                  searchOpen ? "bg-red" : "hover:bg-gray-100/80"
                }`}
                style={{
                  animation: "slideDown 0.6s ease-out forwards",
                  animationDelay: "400ms",
                  opacity: 0,
                }}
              >
                <Search
                  className={`h-5 w-5 transition-colors duration-300 ${searchOpen ? "text-white" : "text-gray-600 group-hover:text-red"}`}
                />
              </button>

              {/* Cart */}
              <button
                onClick={() => navigate("/place-order")}
                aria-label="Shopping Cart"
                className="group relative p-2.5 rounded-full hover:bg-gray-100/80 transition-all duration-300 hover:scale-110 active:scale-95"
                style={{
                  animation: "slideDown 0.6s ease-out forwards",
                  animationDelay: "450ms",
                  opacity: 0,
                }}
              >
                <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-red transition-colors duration-300" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate("/orders")}
                    aria-label="Order History"
                    className="group relative p-2.5 rounded-full hover:bg-gray-100/80 transition-all duration-300 hover:scale-110 active:scale-95"
                    style={{
                      animation: "slideDown 0.6s ease-out forwards",
                      animationDelay: "500ms",
                      opacity: 0,
                    }}
                  >
                    <History className="h-5 w-5 text-gray-600 group-hover:text-red transition-colors duration-300" />
                  </button>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      aria-label="User Profile"
                      className="group relative p-2.5 rounded-full hover:bg-gray-100/80 transition-all duration-300 hover:scale-110 active:scale-95"
                      style={{
                        animation: "slideDown 0.6s ease-out forwards",
                        animationDelay: "550ms",
                        opacity: 0,
                      }}
                    >
                      <UserCircle className="h-5 w-5 text-gray-600 group-hover:text-red transition-colors duration-300" />
                      <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                        <div
                          className="bg-red p-4 text-white"
                          style={{
                            background:
                              "linear-gradient(135deg, var(--color-red) 0%, #8B1414 100%)",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                              <UserCircle className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                              <p className="font-body font-bold text-sm">
                                {user?.name}
                              </p>
                              <p className="text-xs text-white/80">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                          {user?.role === "admin" && (
                            <div className="mt-2 inline-block px-2 py-1 bg-yellow-400 text-gray-900 rounded-full text-xs font-bold">
                              ADMIN
                            </div>
                          )}
                        </div>
                        <div className="py-2">
                          <a
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <UserCircle className="w-5 h-5 text-gray-600" />
                            <span className="font-body text-sm font-semibold text-gray-700">
                              My Profile
                            </span>
                          </a>
                          <a
                            href="/orders"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <History className="w-5 h-5 text-gray-600" />
                            <span className="font-body text-sm font-semibold text-gray-700">
                              Order History
                            </span>
                          </a>
                          {user?.role === "admin" && (
                            <a
                              href="/dashboard"
                              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-t border-gray-100"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                              <span className="font-body text-sm font-semibold text-gray-700">
                                Dashboard
                              </span>
                            </a>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors border-t border-gray-100 text-left"
                          >
                            <LogOut className="w-5 h-5 text-red" />
                            <span className="font-body text-sm font-semibold text-red">
                              Logout
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <a
                    href="/auth"
                    aria-label="User Account"
                    className="group relative p-2.5 rounded-full hover:bg-gray-100/80 transition-all duration-300 hover:scale-110 active:scale-95"
                    style={{
                      animation: "slideDown 0.6s ease-out forwards",
                      animationDelay: "500ms",
                      opacity: 0,
                    }}
                  >
                    <User className="h-5 w-5 text-gray-600 group-hover:text-red transition-colors duration-300" />
                  </a>
                  <a
                    href="/place-order"
                    className="btn-primary ml-2"
                    style={{
                      animation: "slideDown 0.6s ease-out forwards",
                      animationDelay: "550ms",
                      opacity: 0,
                    }}
                  >
                    Place Order
                  </a>
                </>
              )}
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

          {/* ── Desktop Search Bar (slides down) ── */}
          {searchOpen && (
            <div
              className="overflow-hidden pb-5"
              style={{ animation: "expandDown 0.35s ease-out forwards" }}
            >
              <form
                onSubmit={handleSearchSubmit}
                className="relative max-w-2xl"
              >
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name or category..."
                  className="w-full pl-14 pr-28 py-4 text-sm font-body font-semibold rounded-2xl bg-white border border-gray-200 focus:border-red focus:outline-none focus:ring-2 focus:ring-red/20 transition-all duration-300 shadow-lg"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: "0.4rem 1rem", fontSize: "0.65rem" }}
                  >
                    Search
                  </button>
                </div>
              </form>
              {/* Quick chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                {["Soups", "Pancake Mixes", "Syrups", "Baby Pouches"].map(
                  (term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => submitSearch(term)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-red hover:text-white rounded-full text-xs font-body font-bold transition-all duration-300"
                    >
                      {term}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Nav Panel */}
        {mobileOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
            <nav className="max-w-[1600px] mx-auto px-6 py-6">
              {/* Mobile search */}
              <form onSubmit={handleSearchSubmit} className="relative mb-5">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-11 pr-14 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body font-medium outline-none focus:border-red focus:ring-2 focus:ring-red/15 transition-all"
                />
                {searchQuery && (
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-body font-bold text-red"
                  >
                    Go
                  </button>
                )}
              </form>

              <div className="space-y-1">
                {navLinks.map((link, index) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 font-body font-bold text-sm text-gray-800"
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

              <div className="flex items-center justify-around pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate("/place-order")}
                  className="relative p-4 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <ShoppingCart className="h-6 w-6 text-gray-700" />
                  {totalItems > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red text-white text-[9px] font-black rounded-full flex items-center justify-center">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </button>
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => navigate("/orders")}
                      className="p-4 rounded-xl hover:bg-gray-100 transition-all"
                    >
                      <History className="h-6 w-6 text-gray-700" />
                    </button>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="p-4 rounded-xl hover:bg-gray-100 transition-all relative"
                    >
                      <UserCircle className="h-6 w-6 text-gray-700" />
                      <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    </button>
                  </>
                ) : (
                  <a
                    href="/auth"
                    className="p-4 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <User className="h-6 w-6 text-gray-700" />
                  </a>
                )}
              </div>

              {isAuthenticated && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-red rounded-full flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-body font-bold text-sm text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  {user?.role === "admin" && (
                    <a
                      href="/dashboard"
                      className="mt-3 block px-4 py-3 bg-yellow-50 rounded-xl text-center font-body font-bold text-sm text-gray-900 hover:bg-yellow-100 transition-colors"
                    >
                      Go to Dashboard
                    </a>
                  )}
                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full px-4 py-3 bg-red-50 rounded-xl text-center font-body font-bold text-sm text-red hover:bg-red-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}

              <a
                href="/place-order"
                className="btn-primary mt-4 block w-full text-center"
              >
                Place Order
              </a>
            </nav>
          </div>
        )}
      </header>

      <div className="h-20" />

      <style>{`
        @keyframes slideDown  { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideRight { from { opacity:0; transform:translateX(-20px);} to { opacity:1; transform:translateX(0);} }
        @keyframes expandDown { from { max-height:0; opacity:0; } to { max-height:220px; opacity:1; } }
      `}</style>
    </>
  );
}
