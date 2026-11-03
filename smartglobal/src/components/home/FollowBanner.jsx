import React, { useState } from "react";
import { X, Facebook, Instagram } from "lucide-react";

const LINKS = {
  facebook: "https://www.facebook.com/profile.php?id=61565543648021",
  instagram: "https://www.instagram.com/smartglobalke/",
  tiktok: "https://www.tiktok.com/@_smartglobal",
};

const KEY = "sg_follow_banner_dismissed";
const TTL = 24 * 60 * 60 * 1000; // comes back after 24h
const END = new Date("2026-11-26T00:00:00+03:00"); // giveaway over, banner gone

const isDismissed = () => {
  try {
    const t = Number(localStorage.getItem(KEY));
    return !!t && Date.now() - t < TTL;
  } catch {
    return false;
  }
};

const TikTokIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M16.6 2h-3.2v13.2a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .8.1V9.1a6.1 6.1 0 1 0 5.3 6.1V8.6a7.7 7.7 0 0 0 4.4 1.4V6.8a4.5 4.5 0 0 1-4.4-4.8z" />
  </svg>
);

export default function FollowBanner() {
  const [open, setOpen] = useState(() => Date.now() < END && !isDismissed());
  if (!open) return null;

  const close = () => {
    try {
      localStorage.setItem(KEY, String(Date.now()));
    } catch {}
    setOpen(false);
  };

  const pill =
    "inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-body text-[0.7rem] sm:text-xs font-bold text-white transition hover:bg-white hover:text-[var(--color-red)]";

  return (
    <div
      className="relative w-full"
      style={{ backgroundColor: "var(--color-blue)" }}
      role="region"
      aria-label="Follow Smart Global"
    >
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-center gap-2 px-10 py-2.5 text-center sm:flex-row sm:gap-5">
        <p className="font-body text-xs sm:text-sm font-semibold text-white">
          🎉 Join the{" "}
          <span style={{ color: "#FFD23F" }} className="font-extrabold">
            Cook With Kent
          </span>{" "}
          giveaway. Follow &amp; like us first:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <a href={LINKS.facebook} target="_blank" rel="noopener noreferrer" className={pill}>
            <Facebook size={14} /> Facebook
          </a>
          <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className={pill}>
            <Instagram size={14} /> Instagram
          </a>
          <a href={LINKS.tiktok} target="_blank" rel="noopener noreferrer" className={pill}>
            <TikTokIcon className="h-3.5 w-3.5" /> TikTok
          </a>
        </div>
      </div>
      <button
        type="button"
        onClick={close}
        aria-label="Close banner"
        className="absolute right-2 sm:right-4 top-2.5 sm:top-1/2 sm:-translate-y-1/2 rounded-full p-1.5 text-white transition hover:bg-white/20"
      >
        <X size={18} />
      </button>
    </div>
  );
}

