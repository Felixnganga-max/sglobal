import React from "react";
import { Package } from "lucide-react";

// Shared "sold in bulk packs" indicator used on every product thumbnail
// (grid tiles + product detail page). Replaces a bare "×15" circle — that
// notation reads as a multiplier, not "this is a pack of 15 pieces", which
// was confusing shoppers about what they were actually buying.
export default function PackBadge({ moq, className = "" }) {
  if (!moq || moq <= 1) return null;

  return (
    <div
      className={`absolute top-1.5 right-1.5 flex items-center gap-1 rounded-lg text-white shadow-md ${className}`}
      style={{
        backgroundColor: "#f97316",
        padding: "0.28rem 0.5rem",
        lineHeight: 1,
      }}
      title={`Sold in packs of ${moq} — minimum order ${moq} pieces`}
    >
      <Package size={11} strokeWidth={2.75} />
      <span
        className="font-body font-black uppercase"
        style={{ fontSize: "0.58rem", letterSpacing: "-0.01em" }}
      >
        Pack of {moq}
      </span>
    </div>
  );
}
