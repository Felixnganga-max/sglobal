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

// Static hero slides — image + caption, cycled on a timer.
const HERO_SLIDES = [
  { image: assets.just, caption: "A taste of greatness" },
  { image: assets.kent1, caption: "We all love good tastes" },
  { image: assets.kent2, caption: "Enjoy testier, flavoured meals" },
  {
    image: assets.spudss,
    caption: "Sponsoring premium tastes",
  },
];

const CSS = `
  .ns-hero {
    position: relative; overflow: hidden; display: flex; align-items: center;
    min-height: 300px; border-radius: 24px;
    background-color: var(--color-blue);
    box-shadow: 0 12px 32px rgba(1,0,40,0.22);
  }
  @media (max-width: 640px) { .ns-hero { min-height: 250px; border-radius: 20px; } }

  .ns-hero-dots {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
    background-size: 22px 22px;
  }
  .ns-blob { position: absolute; border-radius: 50%; pointer-events: none; }
  .ns-blob.b1 { width: 380px; height: 380px; left: -70px; bottom: -150px; background: var(--color-blue-light); opacity: 0.55; }
  .ns-blob.b2 { width: 96px; height: 96px; left: 22%; bottom: -30px; background: var(--color-red); }
  .ns-blob.b3 { width: 44px; height: 44px; left: 8%; top: 26px; background: var(--color-orange); }
  @media (max-width: 640px) { .ns-blob.b2 { display: none; } }

  /* Image fills the entire right half — full height, no padding, curve matches the card */
  .ns-hero-img-wrap {
    position: absolute; right: 0; top: 0; bottom: 0; width: 50%; z-index: 1;
    overflow: hidden;
    border-radius: 0 24px 24px 0;
  }
  @media (max-width: 640px) { .ns-hero-img-wrap { border-radius: 0 20px 20px 0; } }
  .ns-hero-img {
    display: block; width: 100%; height: 100%; object-fit: cover;
    transition: opacity 0.35s ease, transform 0.35s ease;
  }
  .ns-hero-img.fade-out { opacity: 0; transform: scale(1.03); }
  @media (prefers-reduced-motion: reduce) { .ns-hero-img { transition: none; } }

  /* Text sits on the left, clear of the image */
  .ns-hero-content {
    position: relative; z-index: 2; max-width: 46%;
    padding: clamp(1.25rem, 3vw, 2.25rem) clamp(1.25rem, 3vw, 2.5rem) 2.75rem;
  }
  @media (max-width: 640px) { .ns-hero-content { max-width: 50%; padding-right: 0.5rem; } }

  .ns-hero-title {
    font-family: var(--font-heading); font-weight: 700; color: #fff;
    font-size: clamp(1.5rem, 3.4vw, 2.4rem); line-height: 1.15; margin: 0 0 20px;
  }

  .ns-hero-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .ns-btn-ghost {
    display: inline-flex; align-items: center; padding: 0.65rem 1.3rem; border-radius: 9999px;
    background: transparent; border: 1px solid rgba(255,255,255,0.32); color: rgba(255,255,255,0.9);
    font-family: var(--font-body); font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; cursor: pointer; transition: background 0.2s, border-color 0.2s;
  }
  .ns-btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.55); }

  .ns-hero-dotnav {
    position: absolute; left: 0; right: 0; bottom: 14px; z-index: 3;
    display: flex; justify-content: center; gap: 6px;
  }
  .ns-hero-dot {
    width: 8px; height: 8px; border-radius: 999px; border: none; padding: 0; cursor: pointer;
    background: rgba(255,255,255,0.35); transition: all 0.3s ease;
  }
  .ns-hero-dot.active { width: 24px; background: var(--color-orange); }
`;

export default function HeroPromo() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

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
      <div className="ns-hero-dots" aria-hidden="true" />
      <div className="ns-blob b1" aria-hidden="true" />
      <div className="ns-blob b2" aria-hidden="true" />
      <div className="ns-blob b3" aria-hidden="true" />

      {/* Text: caption, left half */}
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
          <button
            type="button"
            onClick={scrollToProducts}
            className="ns-btn-ghost"
          >
            Browse all
          </button>
        </div>
      </div>

      {/* Image: full-height, full-width-of-right-half, curved with the card */}
      <div className="ns-hero-img-wrap">
        <img
          loading="lazy"
          decoding="async"
          key={heroIdx}
          src={slide.image}
          alt=""
          className={`ns-hero-img${animating ? " fade-out" : ""}`}
        />
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
