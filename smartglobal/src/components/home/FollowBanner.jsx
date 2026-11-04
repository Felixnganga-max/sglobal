import React, { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { assets } from "../../assets/assets";

const LINKS = {
  facebook: "https://www.facebook.com/profile.php?id=61565543648021",
  instagram: "https://www.instagram.com/smartglobalke/",
  tiktok: "https://www.tiktok.com/@_smartglobal",
};

const SLIDES = [
  { id: "c1", src: assets.c1, alt: "Cook With Kent giveaway" },
  { id: "c", src: assets.c, alt: "Cook With Kent giveaway prizes" },
];

const KEY = "sg_follow_banner_dismissed";
const TTL = 24 * 60 * 60 * 1000; // comes back after 24h
const END = new Date("2026-11-26T00:00:00+03:00"); // giveaway over, banner gone
const INTERVAL = 5000;

const isDismissed = () => {
  try {
    const t = Number(localStorage.getItem(KEY));
    return !!t && Date.now() - t < TTL;
  } catch {
    return false;
  }
};

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const TikTokIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M16.6 2h-3.2v13.2a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .8.1V9.1a6.1 6.1 0 1 0 5.3 6.1V8.6a7.7 7.7 0 0 0 4.4 1.4V6.8a4.5 4.5 0 0 1-4.4-4.8z" />
  </svg>
);

const CSS = `
  @keyframes sgFbProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  .sg-fb-progress { transform-origin: left; animation: sgFbProgress ${INTERVAL}ms linear forwards; }
  .sg-fb-paused .sg-fb-progress { animation-play-state: paused; }
  @media (prefers-reduced-motion: reduce) {
    .sg-fb-progress { animation: none; transform: scaleX(0); }
    .sg-fb-slide { transition: none !important; }
  }
`;

export default function FollowBanner() {
  const [open, setOpen] = useState(() => Date.now() < END && !isDismissed());
  const [index, setIndex] = useState(0); // starts on c1
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);

  const go = useCallback(
    (dir) => setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length),
    []
  );

  useEffect(() => {
    if (!open || paused) return;
    const t = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(t);
  }, [open, paused, index, go]);

  if (!open) return null;

  const close = () => {
    try {
      localStorage.setItem(KEY, String(Date.now()));
    } catch {}
    setOpen(false);
  };

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e) => {
    if (touchX.current !== null) {
      const dx = e.changedTouches[0].clientX - touchX.current;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    }
    touchX.current = null;
    setPaused(false);
  };

  const pill =
    "inline-flex items-center gap-1.5 rounded-full bg-white/10 ring-1 ring-white/25 px-3.5 py-1.5 font-body text-[0.7rem] sm:text-xs font-bold text-white transition-all duration-300 hover:bg-white hover:text-[var(--color-red)] hover:-translate-y-0.5 hover:shadow-lg";

  const arrow =
    "absolute top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-[var(--color-blue)] shadow-lg backdrop-blur transition hover:bg-white hover:scale-110 active:scale-95";

  return (
    <section
      className={`w-full ${paused ? "sg-fb-paused" : ""}`}
      aria-roledescription="carousel"
      aria-label="Cook With Kent giveaway"
    >
      <style>{CSS}</style>

      {/* ── Carousel ── */}
      <div
        className="relative w-full overflow-hidden bg-[var(--color-blue)] h-[190px] sm:h-[280px] lg:h-[360px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className="sg-fb-slide absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? "auto" : "none" }}
            aria-hidden={i !== index}
          >
            {/* blurred fill so contain never leaves empty bars */}
            <img
              src={s.src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-125 object-cover opacity-70 blur-2xl"
            />
            <img
              src={s.src}
              alt={s.alt}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              fetchpriority={i === 0 ? "high" : undefined}
              className="relative z-10 h-full w-full object-contain"
            />
          </div>
        ))}

        {/* arrows */}
        <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className={`${arrow} left-4`}>
          <ChevronLeft size={20} />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next slide" className={`${arrow} right-4`}>
          <ChevronRight size={20} />
        </button>

        {/* close */}
        <button
          type="button"
          onClick={close}
          aria-label="Close banner"
          className="absolute right-2.5 top-2.5 sm:right-4 sm:top-4 z-30 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/80 hover:rotate-90 active:scale-90"
        >
          <X size={18} />
        </button>

        {/* dots */}
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === index ? "1.6rem" : "0.5rem",
                backgroundColor: i === index ? "var(--color-red)" : "rgba(255,255,255,0.7)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
              }}
            />
          ))}
        </div>

        {/* progress bar */}
        <div className="absolute inset-x-0 bottom-0 z-20 h-[3px] bg-black/20">
          <div key={`${index}-${paused}`} className="sg-fb-progress h-full" style={{ backgroundColor: "var(--color-red)" }} />
        </div>
      </div>

      {/* ── Follow bar ── */}
      <div style={{ backgroundColor: "var(--color-blue)" }}>
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-center gap-2.5 px-4 py-3 text-center sm:flex-row sm:gap-6">
          <p className="font-body text-xs sm:text-sm font-semibold text-white">
            Follow &amp; like us first to enter the{" "}
            <span style={{ color: "#FFD23F" }} className="font-extrabold">
              Cook With Kent
            </span>{" "}
            giveaway
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a href={LINKS.facebook} target="_blank" rel="noopener noreferrer" className={pill}>
              <FacebookIcon className="h-3.5 w-3.5" /> Facebook
            </a>
            <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className={pill}>
              <InstagramIcon className="h-3.5 w-3.5" /> Instagram
            </a>
            <a href={LINKS.tiktok} target="_blank" rel="noopener noreferrer" className={pill}>
              <TikTokIcon className="h-3.5 w-3.5" /> TikTok
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
