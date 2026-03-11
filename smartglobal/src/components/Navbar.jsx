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

const API_URL = "https://sglobal-plf6.vercel.app/smartglobal/products";

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

  // Mobile search state
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [mobileResults, setMobileResults] = useState([]);
  const [mobileSearching, setMobileSearching] = useState(false);
  const [showMobileResults, setShowMobileResults] = useState(false);

  // Desktop search state
  const [desktopResults, setDesktopResults] = useState([]);
  const [desktopSearching, setDesktopSearching] = useState(false);
  const [showDesktopResults, setShowDesktopResults] = useState(false);

  const navRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileResultsRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const desktopResultsRef = useRef(null);
  const searchTimerRef = useRef(null);
  const desktopTimerRef = useRef(null);

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

  // Close mobile results on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        mobileResultsRef.current &&
        !mobileResultsRef.current.contains(e.target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      )
        setShowMobileResults(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Close desktop results on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        desktopResultsRef.current &&
        !desktopResultsRef.current.contains(e.target) &&
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(e.target)
      )
        setShowDesktopResults(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setDesktopResults([]);
      setShowDesktopResults(false);
      setSearchQuery("");
    }
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

  /* ── Shared live search from API ── */
  const fetchSearchResults = async (query) => {
    const res = await fetch(`${API_URL}?page=1&limit=100`);
    const data = await res.json();
    const all = data.success
      ? data.data || []
      : Array.isArray(data)
        ? data
        : [];
    const q = query.toLowerCase();
    return all
      .filter((p) => {
        const name = (p.title || p.name || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();
        return name.includes(q) || cat.includes(q);
      })
      .slice(0, 8);
  };

  /* ── Mobile search ── */
  const handleMobileSearchChange = (e) => {
    const val = e.target.value;
    setMobileSearchQuery(val);
    clearTimeout(searchTimerRef.current);
    if (!val.trim()) {
      setMobileResults([]);
      setShowMobileResults(false);
      return;
    }
    searchTimerRef.current = setTimeout(async () => {
      setMobileSearching(true);
      setShowMobileResults(true);
      try {
        setMobileResults(await fetchSearchResults(val));
      } catch {
        setMobileResults([]);
      } finally {
        setMobileSearching(false);
      }
    }, 350);
  };

  /* ── Desktop search ── */
  const handleDesktopSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    clearTimeout(desktopTimerRef.current);
    if (!val.trim()) {
      setDesktopResults([]);
      setShowDesktopResults(false);
      return;
    }
    desktopTimerRef.current = setTimeout(async () => {
      setDesktopSearching(true);
      setShowDesktopResults(true);
      try {
        setDesktopResults(await fetchSearchResults(val));
      } catch {
        setDesktopResults([]);
      } finally {
        setDesktopSearching(false);
      }
    }, 350);
  };

  const handleResultClick = (product) => {
    const id = product._id || product.id;
    setMobileSearchQuery("");
    setMobileResults([]);
    setShowMobileResults(false);
    setSearchQuery("");
    setDesktopResults([]);
    setShowDesktopResults(false);
    setSearchOpen(false);
    navigate(`/product/${id}`);
  };

  const getImage = (product) =>
    product.image?.url ||
    product.imageUrl ||
    product.img ||
    product.photo ||
    "https://via.placeholder.com/300?text=No+Image";

  /* ── Result row (shared UI) ── */
  const ResultRow = ({ product }) => {
    const name = product.title || product.name || "Product";
    const inStock = product.stock > 0;
    return (
      <button
        onClick={() => handleResultClick(product)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left border-b border-gray-50 last:border-0"
      >
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
          <img
            src={getImage(product)}
            alt={name}
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300?text=No+Image";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body font-semibold text-gray-900 text-xs leading-snug truncate">
            {name}
          </p>
          <p className="text-[0.6rem] text-gray-400 font-body mt-0.5">
            {product.category}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p
            className="font-heading font-bold text-xs"
            style={{ color: "var(--color-red)" }}
          >
            KSh {product.price?.toLocaleString()}
          </p>
          <p
            className={`text-[0.55rem] font-bold mt-0.5 ${inStock ? "text-green-500" : "text-red-400"}`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </p>
        </div>
      </button>
    );
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
        <div className="max-w-[1600px] mx-auto px-4 lg:px-12">
          {/* ── Main row ── */}
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="/" className="group flex items-center gap-3 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-full scale-150 bg-red"></div>
                <img
                  src={assets.logo}
                  alt="Smart Global"
                  className="h-10 lg:h-12 w-auto relative z-10 transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
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
                  PREMIUM & SPECIALTY FOOD PRODUCTS
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

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Search"
                className={`group relative p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${searchOpen ? "bg-red" : "hover:bg-gray-100/80"}`}
              >
                <Search
                  className={`h-5 w-5 transition-colors duration-300 ${searchOpen ? "text-white" : "text-gray-600 group-hover:text-red"}`}
                />
              </button>

              <button
                onClick={() => navigate("/place-order")}
                aria-label="Shopping Cart"
                className="group relative p-2.5 rounded-full hover:bg-gray-100/80 transition-all duration-300 hover:scale-110 active:scale-95"
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
                  >
                    <History className="h-5 w-5 text-gray-600 group-hover:text-red transition-colors duration-300" />
                  </button>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      aria-label="User Profile"
                      className="group relative p-2.5 rounded-full hover:bg-gray-100/80 transition-all duration-300 hover:scale-110 active:scale-95"
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
                  >
                    <User className="h-5 w-5 text-gray-600 group-hover:text-red transition-colors duration-300" />
                  </a>
                  <a href="/place-order" className="btn-primary ml-2">
                    Place Order
                  </a>
                </>
              )}
            </div>

            {/* ── Mobile right: Cart + Login + Hamburger ── */}
            <div className="flex lg:hidden items-center gap-1">
              <button
                onClick={() => navigate("/place-order")}
                aria-label="Cart"
                className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-all"
              >
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-label="User"
                  className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <UserCircle className="h-5 w-5 text-gray-700" />
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                </button>
              ) : (
                <a
                  href="/auth"
                  aria-label="Login"
                  className="p-2.5 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <User className="h-5 w-5 text-gray-700" />
                </a>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-300"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5 text-gray-800" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-800" />
                )}
              </button>
            </div>
          </div>

          {/* ── Mobile Search Bar (always visible on mobile) ── */}
          <div className="lg:hidden pb-3">
            <div className="flex justify-center">
              <div className="relative w-[90%]" ref={mobileSearchRef}>
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={handleMobileSearchChange}
                  onFocus={() => {
                    if (mobileResults.length > 0) setShowMobileResults(true);
                  }}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-body font-medium outline-none focus:border-red focus:ring-2 focus:ring-red/15 transition-all shadow-sm"
                  style={{ fontSize: "0.8rem" }}
                />
                {mobileSearchQuery && (
                  <button
                    onClick={() => {
                      setMobileSearchQuery("");
                      setMobileResults([]);
                      setShowMobileResults(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                )}

                {showMobileResults && (
                  <div
                    ref={mobileResultsRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    style={{ maxHeight: "320px", overflowY: "auto" }}
                  >
                    {mobileSearching ? (
                      <div className="flex items-center justify-center py-6 gap-2">
                        <div className="w-4 h-4 border-2 border-red border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-body text-gray-500">
                          Searching...
                        </span>
                      </div>
                    ) : mobileResults.length === 0 ? (
                      <div className="py-6 text-center text-xs font-body text-gray-400">
                        No products found for "{mobileSearchQuery}"
                      </div>
                    ) : (
                      mobileResults.map((product) => (
                        <ResultRow
                          key={product._id || product.id}
                          product={product}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Desktop Search Bar (slides down, with live results) ── */}
          {searchOpen && (
            <div
              className="overflow-hidden pb-5 hidden lg:block"
              style={{ animation: "expandDown 0.35s ease-out forwards" }}
            >
              <div className="relative max-w-2xl" ref={desktopSearchRef}>
                <Search className="absolute left-5 top-[1.1rem] h-5 w-5 text-gray-400 pointer-events-none z-10" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleDesktopSearchChange}
                  onFocus={() => {
                    if (desktopResults.length > 0) setShowDesktopResults(true);
                  }}
                  placeholder="Search products by name or category..."
                  className="w-full pl-14 pr-10 py-4 text-sm font-body font-semibold rounded-2xl bg-white border border-gray-200 focus:border-red focus:outline-none focus:ring-2 focus:ring-red/20 transition-all duration-300 shadow-lg"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setDesktopResults([]);
                      setShowDesktopResults(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                )}

                {/* Live results dropdown */}
                {showDesktopResults && (
                  <div
                    ref={desktopResultsRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    style={{ maxHeight: "360px", overflowY: "auto" }}
                  >
                    {desktopSearching ? (
                      <div className="flex items-center justify-center py-6 gap-2">
                        <div className="w-4 h-4 border-2 border-red border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-body text-gray-500">
                          Searching...
                        </span>
                      </div>
                    ) : desktopResults.length === 0 ? (
                      <div className="py-8 text-center text-sm font-body text-gray-400">
                        No products found for "{searchQuery}"
                      </div>
                    ) : (
                      desktopResults.map((product) => (
                        <ResultRow
                          key={product._id || product.id}
                          product={product}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Quick chips */}
              {!showDesktopResults && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {["Soups", "Pancake Mixes", "Syrups", "Baby Pouches"].map(
                    (term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setSearchQuery(term);
                          handleDesktopSearchChange({
                            target: { value: term },
                          });
                        }}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-red hover:text-white rounded-full text-xs font-body font-bold transition-all duration-300"
                      >
                        {term}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Mobile Nav Panel ── */}
        {mobileOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
            <nav className="max-w-[1600px] mx-auto px-6 py-6">
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
                  <div className="mt-3 space-y-1">
                    <a
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <UserCircle className="w-4 h-4 text-gray-500" />
                      <span className="font-body text-sm font-semibold text-gray-700">
                        My Profile
                      </span>
                    </a>
                    <a
                      href="/orders"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <History className="w-4 h-4 text-gray-500" />
                      <span className="font-body text-sm font-semibold text-gray-700">
                        Order History
                      </span>
                    </a>
                    {user?.role === "admin" && (
                      <a
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-body text-sm font-semibold text-gray-700">
                          Dashboard
                        </span>
                      </a>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full px-4 py-3 bg-red-50 rounded-xl text-center font-body font-bold text-sm text-red hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
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

      <div className="h-[108px] lg:h-20" />

      <style>{`
        @keyframes slideDown  { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideRight { from { opacity:0; transform:translateX(-20px);} to { opacity:1; transform:translateX(0);} }
        @keyframes expandDown { from { max-height:0; opacity:0; } to { max-height:500px; opacity:1; } }
      `}</style>
    </>
  );
}
