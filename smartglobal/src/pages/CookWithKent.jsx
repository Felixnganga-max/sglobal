import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, MapPin } from "lucide-react";
import { useProducts } from "../lib/useProducts";
import { isCubes } from "../lib/priorityMix";
import ProductTile from "../components/ProductTile";
import { assets } from "../assets/assets";

/* ───────────── Edit campaign details here ───────────── */
const HASHTAGS = ["#cookwithkent", "#ladhayakent", "#twendefestiveankent"];
const END = new Date("2026-11-25T23:59:59+03:00");
const OVERLAY = "rgba(1,0,40,0.4)"; // light blue tint over the hero image

const PRIZES = [
  { place: "1st", amount: "KSh 10,000" },
  { place: "2nd", amount: "KSh 7,000" },
  { place: "3rd", amount: "KSh 5,000" },
];

const SOCIALS = [
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61565543648021", Icon: FacebookIcon },
  { name: "Instagram", href: "https://www.instagram.com/smartglobalke/", Icon: InstagramIcon },
  { name: "TikTok", href: "https://www.tiktok.com/@_smartglobal", Icon: TikTokIcon },
];

const STOCKISTS = [
  "Naivas",
  "Carrefour",
  "Quickmart",
  "Gilani's Supermarket",
  "Cleanshelf",
  "Chandarana Foodplus",
  "Zucchini Food Market",
  "Saving Home",
  "Onn The Way Supermarket",
  "Westgate Cinema",
  "Kamindi Selfridges",
  "Galmart Supermarket",
  "Karen Provision Stores",
  "Fairmart Supermarkets",
];

const STEPS = [
  { title: "Follow & like us", body: "Follow Smart Global Ltd on TikTok, Instagram and Facebook.", extra: "socials" },
  { title: "Get your Kent", body: "Buy Kent cubes or stock powder from a supermarket near you.", extra: "stockists" },
  { title: "Cook & film", body: "Record a 1-minute video cooking with Kent cubes or stock powder. Make it festive." },
  { title: "Post & tag", body: "Post your video with all three hashtags and tag Smart Global Ltd.", extra: "tags" },
];

const BANNERS = [assets.c1, assets.c].filter(Boolean); // starts on c1
const BANNER_MS = 5000;

/* ───────────── Icons ───────────── */
function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}
function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TikTokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.6 2h-3.2v13.2a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .8.1V9.1a6.1 6.1 0 1 0 5.3 6.1V8.6a7.7 7.7 0 0 0 4.4 1.4V6.8a4.5 4.5 0 0 1-4.4-4.8z" />
    </svg>
  );
}

/* ───────────── Countdown ───────────── */
function useCountdown(target) {
  const calc = () => Math.max(0, target.getTime() - Date.now());
  const [ms, setMs] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setMs(calc()), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line
  }, []);
  const s = Math.floor(ms / 1000);
  return {
    done: ms === 0,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
  };
}
const pad = (n) => String(n).padStart(2, "0");

/* ───────────── Banner carousel (c1 → c), full width, natural height ───────────── */
function BannerCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || BANNERS.length < 2) return;
    const t = setTimeout(() => setI((x) => (x + 1) % BANNERS.length), BANNER_MS);
    return () => clearTimeout(t);
  }, [i, paused]);

  if (BANNERS.length === 0) return null;

  return (
    <section
      className="relative grid w-full overflow-hidden"
      aria-label="Cook With Kent banners"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {BANNERS.map((src, n) => (
        <img
          key={n}
          src={src}
          alt="Cook With Kent giveaway"
          loading={n === 0 ? "eager" : "lazy"}
          decoding="async"
          aria-hidden={n !== i}
          className="col-start-1 row-start-1 block h-auto w-full transition-opacity duration-700"
          style={{ opacity: n === i ? 1 : 0, pointerEvents: n === i ? "auto" : "none" }}
        />
      ))}

      {BANNERS.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
          {BANNERS.map((_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Show banner ${n + 1}`}
              aria-current={n === i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: n === i ? "1.6rem" : "0.5rem",
                backgroundColor: n === i ? "var(--color-red)" : "rgba(255,255,255,0.7)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ───────────── Product filter: Kent cubes + Kent stock ───────────── */
const textOf = (p) => `${p.title || p.name || ""} ${p.brand || ""} ${p.category || ""}`;
const isKent = (p) => /kent/i.test(textOf(p));
const isStock = (p) => /stock|bouillon|bouillion|powder/i.test(textOf(p));

export default function CookWithKent() {
  const { products = [], loading } = useProducts();
  const cd = useCountdown(END);

  const picks = useMemo(
    () =>
      products
        .filter((p) => isKent(p) && (isCubes(p) || isStock(p)))
        .sort((a, b) => Number(isCubes(b)) - Number(isCubes(a))),
    [products]
  );

  const tiles = [
    ["Days", cd.days],
    ["Hours", cd.hours],
    ["Mins", cd.mins],
    ["Secs", cd.secs],
  ];

  return (
    <main className="w-full bg-white">
      {/* ───────── Hero: one image (assets.ent), natural ratio, light blue overlay ───────── */}
      <section className="grid min-h-[420px] w-full overflow-hidden bg-neutral-800">
        {assets.ent && (
          <img
            src={assets.ent}
            alt=""
            fetchpriority="high"
            className="col-start-1 row-start-1 block h-full w-full object-cover"
          />
        )}
        <div className="col-start-1 row-start-1" style={{ backgroundColor: OVERLAY }} />

        <div className="relative z-10 col-start-1 row-start-1 flex flex-col justify-between gap-10 p-6 sm:p-10 lg:px-16 lg:py-12">
          {/* logo */}
          <div className="flex items-center gap-3">
            <img src={assets.logo} alt="Smart Global" className="h-10 w-auto sm:h-12" />
            <span className="font-heading text-lg font-black tracking-tight text-white sm:text-xl">
              SMART GLOBAL
            </span>
          </div>

          {/* content */}
          <div className="max-w-xl">
            <h1
              className="font-heading font-extrabold leading-[1.05] text-white"
              style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)" }}
            >
              Cook With <span style={{ color: "var(--color-orange)" }}>Kent</span>
              <br />
              Giveaway
            </h1>

            <p className="mt-4 font-body text-sm leading-relaxed text-white/90 sm:text-base">
              Celebrate with us by cooking with Kent cubes or stock powder. Post your 1-minute video, complete the
              entry steps and get a chance to win cash prizes and Kent hampers.
            </p>

            {/* timer */}
            <div className="mt-7">
              {cd.done ? (
                <p className="font-heading text-lg font-bold text-white">The giveaway has ended.</p>
              ) : (
                <div className="flex gap-2.5 sm:gap-3">
                  {tiles.map(([label, v]) => (
                    <div
                      key={label}
                      className="flex h-[74px] w-[64px] flex-col items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/40 backdrop-blur-sm sm:h-20 sm:w-[78px]"
                    >
                      <span className="font-heading text-2xl font-medium tabular-nums sm:text-3xl">{pad(v)}</span>
                      <span className="font-body text-[0.6rem] font-semibold uppercase tracking-widest text-white/90">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* participate + socials */}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href="#how"
                className="rounded-xl bg-red px-7 py-3 font-body text-sm font-bold text-white shadow-lg transition hover:bg-red-dark active:scale-95"
              >
                Participate
              </a>
              <div className="flex items-center gap-2.5">
                {SOCIALS.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/40 backdrop-blur-sm transition hover:bg-white hover:text-blue"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Banners, directly under the hero ───────── */}
      <BannerCarousel />

      {/* ───────── How to join ───────── */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-40 px-4 py-14 sm:py-20">
        <div className="text-center">
          <p className="text-eyebrow mb-1">Simple as 1-2-3-4</p>
          <h2 className="text-section-title text-gray-900">How to join</h2>
          <div className="section-rule-center" />
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <span className="absolute right-5 top-3 font-heading text-6xl font-black text-gray-100 transition group-hover:text-blue-tint">
                {i + 1}
              </span>
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red font-heading text-lg font-extrabold text-white shadow-md">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-blue">{s.title}</h3>
                <p className="mt-1.5 font-body text-sm leading-relaxed text-gray-600">{s.body}</p>

                {s.extra === "socials" && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SOCIALS.map(({ name, href }) => (
                      <a
                        key={name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-blue px-3 py-1 font-body text-xs font-bold text-white transition hover:bg-blue-dark"
                      >
                        {name}
                      </a>
                    ))}
                  </div>
                )}

                {s.extra === "stockists" && (
                  <a
                    href="#stockists"
                    className="mt-4 inline-block rounded-full bg-blue px-3 py-1 font-body text-xs font-bold text-white transition hover:bg-blue-dark"
                  >
                    Find a store
                  </a>
                )}

                {s.extra === "tags" && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {HASHTAGS.map((h) => (
                      <span
                        key={h}
                        className="rounded-full bg-gray-100 px-2.5 py-1 font-body text-xs font-bold text-red"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Prizes ───────── */}
      <section className="bg-soft px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-eyebrow mb-1">Up for grabs</p>
          <h2 className="text-section-title text-gray-900">What you can win</h2>
          <div className="section-rule-center" />

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {PRIZES.map((p, i) => (
              <div
                key={p.place}
                className={`rounded-2xl p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                  i === 0 ? "bg-blue text-white sm:-translate-y-3" : "bg-white text-gray-900"
                }`}
              >
                <Trophy className="mx-auto h-8 w-8 text-orange" />
                <p
                  className={`mt-3 font-body text-xs font-bold uppercase tracking-widest ${
                    i === 0 ? "text-white/70" : "text-gray-500"
                  }`}
                >
                  {p.place} place
                </p>
                <p className={`mt-1 font-heading text-3xl font-extrabold ${i === 0 ? "text-white" : "text-red"}`}>
                  {p.amount}
                </p>
                <p className={`mt-1 font-body text-xs ${i === 0 ? "text-white/70" : "text-gray-500"}`}>
                  + Kent gift hamper
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 font-body text-sm text-gray-600">
            4th place wins a Kent gift hamper. Winners are announced on 25 November.
          </p>
        </div>
      </section>

      {/* ───────── Products ───────── */}
      <section id="products" className="page-x section-y scroll-mt-40">
        <div className="mb-8 text-center">
          <p className="text-eyebrow mb-1">Use in your video</p>
          <h2 className="text-section-title text-gray-900">Kent cubes &amp; stock</h2>
          <div className="section-rule-center" />
          <p className="mx-auto mt-3 max-w-xl font-body text-sm text-gray-600">
            Cook with any of these to qualify for the giveaway.
          </p>
        </div>

        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {loading
            ? [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-gray-100 bg-white"
                  style={{ height: 220 }}
                />
              ))
            : picks.map((p) => <ProductTile key={p._id || p.id} product={p} />)}
        </div>
      </section>

      {/* ───────── Where to buy ───────── */}
      {STOCKISTS.length > 0 && (
        <section id="stockists" className="scroll-mt-40 bg-soft px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-eyebrow mb-1">Near you</p>
              <h2 className="text-section-title text-gray-900">Where to buy Kent</h2>
              <div className="section-rule-center" />
              <p className="mx-auto mt-3 max-w-xl font-body text-sm text-gray-600">
                Find Kent at these supermarkets.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {STOCKISTS.map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-4 font-body text-sm font-semibold text-gray-800 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-red" />
                  {s}
                </div>
              ))}
            </div>

            <p className="mt-8 text-center font-body text-sm text-gray-600">
              Can't find a store near you?{" "}
              <Link to="/products" className="font-bold text-red underline">
                Order from us
              </Link>
            </p>
          </div>
        </section>
      )}

      <p className="px-4 py-10 text-center font-body text-[0.7rem] text-gray-400">
        This giveaway is not sponsored, endorsed or administered by Facebook, Instagram or TikTok.
      </p>
    </main>
  );
}