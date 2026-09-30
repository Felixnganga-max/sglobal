import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { assets } from "../assets/assets";

function scrollToProducts() {
  const el = document.getElementById("featured-products");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollBy({ top: window.innerHeight * 0.75, behavior: "smooth" });
  }
}

// pos = focal point (object-position). Tune per image so the subject stays in frame.
const HERO_SLIDES = [
  { image: assets.just,   caption: "A taste of greatness",           pos: "center 40%" },
  { image: assets.kent1,  caption: "We all love good tastes",        pos: "center center" },
  { image: assets.kent2,  caption: "Enjoy testier, flavoured meals", pos: "center center" },
  { image: assets.spudss, caption: "Sponsoring premium tastes",      pos: "center center" },
];

const CSS = `
  .ns-hero {
    position: relative; overflow: hidden; display: flex; align-items: center;
    width: 100%;
    aspect-ratio: 2 / 1;
    min-height: 380px;
    max-height: min(640px, 80vh);
    max-height: min(640px, 80dvh);
    border-radius: 24px;
    background-color: var(--color-blue);
    box-shadow: 0 12px 32px rgba(1,0,40,0.22);
  }
  @media (max-width: 1024px) {
    .ns-hero { aspect-ratio: 16 / 9; }
  }
  @media (max-width: 640px) {
    .ns-hero {
      aspect-ratio: 1 / 1;
      min-height: 0;
      max-height: 78vh;
      max-height: 78dvh;
      border-radius: 20px;
    }
  }

  /* Blurred copy fills any space the full image doesn't cover */
  .ns-hero-bg {
    position: absolute; inset: -30px; z-index: 0;
    width: calc(100% + 60px); height: calc(100% + 60px);
    object-fit: cover; filter: blur(28px) saturate(1.2); opacity: 0.9;
  }

  /* Full image, never cropped */
  .ns-hero-img {
    position: absolute; inset: 0; z-index: 0;
    width: 100%; height: 100%;
    object-fit: contain;
    object-position: center;
    transition: opacity 0.35s ease, transform 0.35s ease;
  }
  .ns-hero-img.fade-out { opacity: 0; transform: scale(1.03); }
  @media (prefers-reduced-motion: reduce) { .ns-hero-img { transition: none; } }
  @media (max-width: 640px) { .ns-hero-img { object-position: center top; } }

  /* Overlay: dark on the left for text, fading out to the right */
  .ns-hero-overlay {
    position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background: linear-gradient(90deg,
      rgba(1,0,40,0.88) 0%,
      rgba(1,0,40,0.65) 35%,
      rgba(1,0,40,0.2) 65%,
      rgba(1,0,40,0) 100%);
  }
  @media (max-width: 640px) {
    .ns-hero-overlay { background: linear-gradient(180deg, rgba(1,0,40,0.35) 0%, rgba(1,0,40,0.85) 100%); }
  }

  .ns-hero-content {
    position: relative; z-index: 2; max-width: 55%;
    padding: clamp(1.5rem, 4vw, 3.5rem) clamp(1.25rem, 4vw, 3.5rem) 3.25rem;
  }
  @media (max-width: 640px) {
    .ns-hero-content { max-width: 100%; align-self: flex-end; width: 100%; }
  }

  .ns-hero-title {
    font-family: var(--font-heading); font-weight: 700; color: #fff;
    font-size: clamp(1.9rem, 4.6vw, 3.4rem); line-height: 1.1; margin: 0 0 24px;
    text-shadow: 0 2px 16px rgba(0,0,0,0.35);
  }

  .ns-hero-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .ns-btn-ghost {
    display: inline-flex; align-items: center; padding: 0.65rem 1.3rem; border-radius: 9999px;
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.4); color: #fff;
    font-family: var(--font-body); font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; cursor: pointer; backdrop-filter: blur(6px);
    transition: background 0.2s, border-color 0.2s;
  }
  .ns-btn-ghost:hover { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.7); }

  .ns-hero-dotnav {
    position: absolute; left: 0; right: 0; bottom: 16px; z-index: 3;
    display: flex; justify-content: center; gap: 6px;
  }
  .ns-hero-dot {
    width: 8px; height: 8px; border-radius: 999px; border: none; padding: 0; cursor: pointer;
    background: rgba(255,255,255,0.45); transition: all 0.3s ease;
  }
  .ns-hero-dot.active { width: 24px; background: var(--color-orange); }
`;

export default function HeroPromo() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Preload all slides so transitions never flash
  useEffect(() => {
    HERO_SLIDES.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setAnimating(true);
      timeoutRef.current = setTimeout(() => {
        setHeroIdx((i) => (i + 1) % HERO_SLIDES.length);
        setAnimating(false);
      }, 350);
    }, 4000);
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const slide = HERO_SLIDES[heroIdx];

  return (
    <section aria-label="Hero promo" className="ns-hero">
      <style>{CSS}</style>

      <img src={slide.image} alt="" aria-hidden="true" className="ns-hero-bg" />
      <img
        key={heroIdx}
        src={slide.image}
        alt=""
        decoding="async"
        fetchpriority={heroIdx === 0 ? "high" : "auto"}
        className={`ns-hero-img${animating ? " fade-out" : ""}`}
      />
      <div className="ns-hero-overlay" aria-hidden="true" />

      <div className="ns-hero-content">
        <h2 className="ns-hero-title">{slide.caption}</h2>
        <div className="ns-hero-actions">
          <button
            type="button"
            onClick={scrollToProducts}
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.7rem",
              padding: "0.65rem 1.4rem",
            }}
          >
            Shop now <ArrowRight size={13} />
          </button>
          <button type="button" onClick={scrollToProducts} className="ns-btn-ghost">
            Browse all
          </button>
        </div>
      </div>

      <div className="ns-hero-dotnav">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`ns-hero-dot${i === heroIdx ? " active" : ""}`}
            onClick={() => {
              setHeroIdx(i);
              setAnimating(false);
            }}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === heroIdx}
          />
        ))}
      </div>
    </section>
  );
}