import React, { useState, useEffect, useRef, useMemo } from "react";
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
  LayoutGrid,
  Gift,
  RotateCcw,
  Phone,
  LayoutDashboard,
} from "lucide-react";
import { assets } from "../assets/assets";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/Cartcontext";
import { useProducts } from "../lib/useProducts";
import { API_BASE_URL } from "../api/config";

const API_URL = `${API_BASE_URL}/products`;
const PHONE = ""; // e.g. "+254 7XX XXX XXX" — shows in the top bar when set
const TOP_H = 36; // top bar height (px); header slides up by this on scroll

const NAV_LINKS = [
  { name: "Products", href: "/products" },
  { name: "Recipes", href: "/recipes" },
  { name: "Blogs", href: "/blogs" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

/* ── one shared product list for live search (fetched once) ── */
let productCache = null;
const loadAllProducts = () => {
  if (!productCache) {
    productCache = fetch(`${API_URL}?page=1&limit=100`)
      .then((r) => r.json())
      .then((d) => (d.success ? d.data || [] : Array.isArray(d) ? d : []))
      .catch((e) => {
        productCache = null;
        throw e;
      });
  }
  return productCache;
};

const imgOf = (p) =>
  p.image?.url || p.imageUrl || p.img || p.photo || "https://via.placeholder.com/300?text=No+Image";

/* ───────────────────────── Search box ───────────────────────── */
function SearchBox({ className = "", onPick }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const wrapRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    const out = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShow(false);
    };
    document.addEventListener("mousedown", out);
    return () => document.removeEventListener("mousedown", out);
  }, []);

  const run = (val) => {
    setQ(val);
    clearTimeout(timer.current);
    if (!val.trim()) {
      setResults([]);
      setShow(false);
      return;
    }
    timer.current = setTimeout(async () => {
      setLoading(true);
      setShow(true);
      try {
        const all = await loadAllProducts();
        const s = val.toLowerCase();
        setResults(
          all
            .filter((p) =>
              `${p.title || p.name || ""} ${p.category || ""}`.toLowerCase().includes(s)
            )
            .slice(0, 8)
        );
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
  };

  const pick = (p) => {
    setQ("");
    setResults([]);
    setShow(false);
    onPick?.();
    navigate(`/product/${p._id || p.id}`);
  };

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div className="flex items-center overflow-hidden rounded-xl border-2 border-gray-200 bg-white transition focus-within:border-blue focus-within:shadow-[0_0_0_4px_rgba(1,0,40,0.08)]">
        <Search className="ml-3.5 h-4 w-4 shrink-0 text-gray-400" />
        <input
          type="text"
          value={q}
          onChange={(e) => run(e.target.value)}
          onFocus={() => results.length > 0 && setShow(true)}
          placeholder="Search for products..."
          className="w-full bg-transparent px-3 py-2.5 font-body text-sm font-medium outline-none placeholder:text-gray-400"
        />
        {q && (
          <button
            type="button"
            onClick={() => run("")}
            aria-label="Clear search"
            className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <X className="h-3 w-3 text-gray-500" />
          </button>
        )}
        <button
          type="button"
          onClick={() => q.trim() && navigate(`/products?search=${encodeURIComponent(q.trim())}`)}
          aria-label="Search"
          className="hidden sm:flex h-full items-center bg-red px-5 py-3 text-white transition hover:bg-red-dark"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      {show && (
        <div
          className="absolute left-0 right-0 top-full mt-1.5 max-h-[360px] overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-2xl"
          style={{ zIndex: 99999 }}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-6">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue border-t-transparent" />
              <span className="font-body text-xs text-gray-500">Searching...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-6 text-center font-body text-xs text-gray-400">No products found for "{q}"</div>
          ) : (
            results.map((p) => {
              const name = p.title || p.name || "Product";
              const inStock = p.stock > 0;
              return (
                <button
                  key={p._id || p.id}
                  onClick={() => pick(p)}
                  className="flex w-full items-center gap-3 border-b border-gray-50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-gray-50"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                    <img
                      loading="lazy"
                      src={imgOf(p)}
                      alt={name}
                      className="h-full w-full object-contain p-1"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/300?text=No+Image")}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body text-xs font-semibold text-gray-900">{name}</p>
                    <p className="mt-0.5 font-body text-[0.6rem] text-gray-400">{p.category}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-heading text-xs font-bold text-red">KSh {p.price?.toLocaleString()}</p>
                    <p className={`mt-0.5 text-[0.55rem] font-bold ${inStock ? "text-green-500" : "text-red-400"}`}>
                      {inStock ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Navbar ───────────────────────── */
export default function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { products = [] } = useProducts();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileCats, setMobileCats] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [headerH, setHeaderH] = useState(150);
  const [user, setUser] = useState(null);

  const headerRef = useRef(null);
  const catRef = useRef(null);
  const userRef = useRef(null);

  const isAuthenticated = !!user;

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(),
    [products]
  );

  /* auth */
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const data = localStorage.getItem("user");
      setUser(token && data ? JSON.parse(data) : null);
    } catch {
      setUser(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setUserOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  /* scroll → slide the top bar away */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > TOP_H);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* spacer height = real header height (never changes on scroll) */
  useEffect(() => {
    if (!headerRef.current) return;
    const ro = new ResizeObserver(() => setHeaderH(headerRef.current.offsetHeight));
    ro.observe(headerRef.current);
    setHeaderH(headerRef.current.offsetHeight);
    return () => ro.disconnect();
  }, []);

  /* click outside */
  useEffect(() => {
    const out = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener("mousedown", out);
    return () => document.removeEventListener("mousedown", out);
  }, []);

  const catHref = (c) => `/products?category=${encodeURIComponent(c)}`;

  const CartButton = ({ compact }) => (
    <button
      onClick={() => navigate("/place-order")}
      aria-label="Cart"
      className={`relative inline-flex items-center gap-2 rounded-xl bg-blue text-white transition hover:bg-blue-dark active:scale-95 ${
        compact ? "p-2.5" : "px-4 py-2.5"
      }`}
    >
      <ShoppingCart className="h-5 w-5" />
      {!compact && <span className="font-body text-xs font-bold">Cart</span>}
      {totalItems > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red px-1 text-[10px] font-black text-white ring-2 ring-white">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </button>
  );

  return (
    <>
      <header
        ref={headerRef}
        className="fixed left-0 right-0 top-0 transition-transform duration-300 ease-out"
        style={{ zIndex: 9999, transform: scrolled ? `translateY(-${TOP_H}px)` : "none" }}
      >
        {/* ── Top promo bar ── */}
        <div className="bg-blue text-white" style={{ height: TOP_H }}>
          <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-4 px-4 lg:px-12">
            <Link
              to="/cook-with-kent"
              className="flex min-w-0 items-center gap-2 font-body text-[0.68rem] font-semibold sm:text-xs"
            >
              <Gift className="h-3.5 w-3.5 shrink-0" style={{ color: "#FFD23F" }} />
              <span className="truncate">
                <span style={{ color: "#FFD23F" }} className="font-extrabold">
                  Cook With Kent
                </span>{" "}
                giveaway is live. Win cash prizes &amp; hampers.{" "}
                <span className="underline underline-offset-2">Join now</span>
              </span>
            </Link>
            <div className="hidden items-center gap-5 font-body text-xs font-medium sm:flex">
              <p
                className="flex items-center gap-1.5 text-white/85 transition hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" /> 
              </p>
              {PHONE && (
                <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="flex items-center gap-1.5 text-white/85 transition hover:text-white">
                  <Phone className="h-3.5 w-3.5" /> {PHONE}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Main row ── */}
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 lg:h-[76px] lg:gap-8 lg:px-12">
            <Link to="/" className="group flex shrink-0 items-center gap-3">
              <img
                src={assets.logo}
                alt="Smart Global"
                className="h-10 w-auto transition duration-500 group-hover:scale-105 lg:h-12"
              />
              <div className="hidden xl:block">
                <div className="font-heading text-xl font-black leading-none tracking-tighter text-gray-900">
                  SMART GLOBAL
                </div>
                <div className="mt-1 text-[0.58rem] font-semibold tracking-[0.2em] text-gray-500">
                  PREMIUM &amp; SPECIALTY FOOD PRODUCTS
                </div>
              </div>
            </Link>

            {/* desktop search */}
            <SearchBox className="hidden max-w-3xl flex-1 lg:block" />

            {/* desktop right */}
            <div className="ml-auto hidden items-center gap-5 lg:flex">
              {isAuthenticated ? (
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setUserOpen((v) => !v)}
                    className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition hover:bg-gray-50"
                  >
                    <div className="relative">
                      <UserCircle className="h-8 w-8 text-gray-700" />
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                    </div>
                    <div className="leading-tight">
                      <p className="font-body text-[0.68rem] text-gray-500">Hello,</p>
                      <p className="max-w-[110px] truncate font-body text-sm font-bold text-gray-900">
                        {user?.name?.split(" ")[0] || "Account"}
                      </p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition ${userOpen ? "rotate-180" : ""}`} />
                  </button>

                  {userOpen && (
                    <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                      <div
                        className="p-4 text-white"
                        style={{ background: "linear-gradient(135deg, var(--color-blue) 0%, var(--color-blue-light) 100%)" }}
                      >
                        <p className="font-body text-sm font-bold">{user?.name}</p>
                        <p className="text-xs text-white/80">{user?.email}</p>
                        {user?.role === "admin" && (
                          <span className="mt-2 inline-block rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-gray-900">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <div className="py-1">
                        <Link to="/orders" onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-3 transition hover:bg-gray-50">
                          <History className="h-4 w-4 text-gray-500" />
                          <span className="font-body text-sm font-semibold text-gray-700">Order History</span>
                        </Link>
                        {user?.role === "admin" && (
                          <Link to="/dashboard" onClick={() => setUserOpen(false)} className="flex items-center gap-3 border-t border-gray-100 px-4 py-3 transition hover:bg-gray-50">
                            <LayoutDashboard className="h-4 w-4 text-gray-500" />
                            <span className="font-body text-sm font-semibold text-gray-700">Dashboard</span>
                          </Link>
                        )}
                        <button onClick={logout} className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-left transition hover:bg-red-50">
                          <LogOut className="h-4 w-4 text-red" />
                          <span className="font-body text-sm font-semibold text-red">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/auth" className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-gray-50">
                  <User className="h-7 w-7 text-gray-700 transition group-hover:text-red" />
                  <div className="leading-tight">
                    <p className="font-body text-sm font-bold text-gray-900">Sign in /</p>
                    <p className="font-body text-sm font-medium text-gray-600">register</p>
                  </div>
                </Link>
              )}
              <CartButton />
            </div>

            {/* mobile right */}
            <div className="ml-auto flex items-center gap-1.5 lg:hidden">
              <CartButton compact />
              <Link
                to={isAuthenticated ? "/orders" : "/auth"}
                aria-label="Account"
                className="rounded-xl p-2.5 transition hover:bg-gray-100"
              >
                {isAuthenticated ? <UserCircle className="h-5 w-5 text-gray-700" /> : <User className="h-5 w-5 text-gray-700" />}
              </Link>
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="rounded-xl p-2.5 transition hover:bg-gray-100"
              >
                {mobileOpen ? <X className="h-5 w-5 text-gray-800" /> : <Menu className="h-5 w-5 text-gray-800" />}
              </button>
            </div>
          </div>

          {/* mobile search */}
          <div className="px-4 pb-3 lg:hidden">
            <SearchBox onPick={() => setMobileOpen(false)} />
          </div>
        </div>

        {/* ── Category row (desktop) ── */}
        <nav className="hidden border-b border-gray-200 bg-white shadow-sm lg:block">
          <div className="mx-auto flex h-12 max-w-[1600px] items-stretch gap-1 px-12">
            <div className="relative" ref={catRef}>
              <button
                onClick={() => setCatOpen((v) => !v)}
                aria-expanded={catOpen}
                className="flex h-full items-center gap-2.5 bg-red px-5 font-body text-[0.72rem] font-bold uppercase tracking-wider text-white transition hover:bg-red-dark"
              >
                <LayoutGrid className="h-4 w-4" />
                All Categories
                <ChevronDown className={`h-4 w-4 transition ${catOpen ? "rotate-180" : ""}`} />
              </button>

              {catOpen && (
                <div className="absolute left-0 top-full w-[560px] rounded-b-2xl border border-gray-200 bg-white p-5 shadow-2xl">
                  {categories.length === 0 ? (
                    <p className="py-4 text-center font-body text-sm text-gray-400">Loading categories…</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-1">
                      {categories.map((c) => (
                        <Link
                          key={c}
                          to={catHref(c)}
                          onClick={() => setCatOpen(false)}
                          className="rounded-lg px-3 py-2.5 font-body text-sm font-semibold text-gray-700 transition hover:bg-blue-tint hover:text-blue"
                        >
                          {c}
                        </Link>
                      ))}
                    </div>
                  )}
                  <Link
                    to="/products"
                    onClick={() => setCatOpen(false)}
                    className="mt-3 block rounded-xl bg-blue py-2.5 text-center font-body text-xs font-bold uppercase tracking-wider text-white transition hover:bg-blue-dark"
                  >
                    View all products
                  </Link>
                </div>
              )}
            </div>

            <div className="flex flex-1 items-center gap-1 pl-4">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.name}
                  to={l.href}
                  className="group relative px-4 py-2 font-body text-[0.72rem] font-bold uppercase tracking-wider text-gray-700 transition hover:text-red"
                >
                  {l.name}
                  <span className="absolute inset-x-4 -bottom-[7px] h-0.5 origin-left scale-x-0 bg-red transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              ))}
                          <Link
                to="/cook-with-kent"
                className="btn-primary ml-2"
                style={{ padding: "0.55rem 1.4rem", display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <Gift className="h-3.5 w-3.5" /> Cook With Kent
              </Link>
            </div>

            <div className="flex items-center">
              <Link to="/place-order" className="btn-primary" style={{ padding: "0.55rem 1.4rem" }}>
                Place Order
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div className="max-h-[70vh] overflow-y-auto border-t border-gray-200 bg-white shadow-2xl lg:hidden">
            <div className="space-y-1 px-5 py-4">
              <Link
                to="/cook-with-kent"
                onClick={() => setMobileOpen(false)}
                className="mb-2 flex items-center justify-center gap-2 rounded-xl py-3 font-body text-sm font-extrabold text-white"
                style={{ background: "linear-gradient(135deg, var(--color-red) 0%, var(--color-orange) 100%)" }}
              >
                <Gift className="h-4 w-4" /> Cook With Kent Giveaway
              </Link>

              <button
                onClick={() => setMobileCats((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 font-body text-sm font-bold text-gray-800 hover:bg-gray-100"
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-red" /> All Categories
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition ${mobileCats ? "rotate-180" : ""}`} />
              </button>
              {mobileCats && (
                <div className="ml-4 space-y-0.5 border-l-2 border-gray-100 pl-3">
                  {categories.map((c) => (
                    <Link
                      key={c}
                      to={catHref(c)}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-2 font-body text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              )}

              {NAV_LINKS.map((l) => (
                <Link
                  key={l.name}
                  to={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-4 py-3 font-body text-sm font-bold text-gray-800 hover:bg-gray-100"
                >
                  {l.name}
                </Link>
              ))}

              {isAuthenticated && (
                <div className="mt-3 border-t border-gray-200 pt-3">
                  <div className="mb-2 rounded-xl bg-gray-50 px-4 py-3">
                    <p className="font-body text-sm font-bold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-50">
                    <History className="h-4 w-4 text-gray-500" />
                    <span className="font-body text-sm font-semibold text-gray-700">Order History</span>
                  </Link>
                  {user?.role === "admin" && (
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-50">
                      <LayoutDashboard className="h-4 w-4 text-gray-500" />
                      <span className="font-body text-sm font-semibold text-gray-700">Dashboard</span>
                    </Link>
                  )}
                  <button onClick={logout} className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 font-body text-sm font-bold text-red">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}

              <Link to="/place-order" onClick={() => setMobileOpen(false)} className="btn-primary mt-3 block w-full text-center">
                Place Order
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* spacer = measured header height */}
      <div style={{ height: headerH }} aria-hidden="true" />
    </>
  );
}