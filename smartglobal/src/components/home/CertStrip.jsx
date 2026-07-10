import React from "react";
import { ShieldCheck } from "lucide-react";

const ENTRIES = [
  "KEBS Certified",
  "Halal Certified",
  "Carrefour",
  "Naivas",
  "Quickmart",
  "Chandarana",
];

export default function CertStrip() {
  return (
    <section className="page-x py-8 border-t border-b" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {ENTRIES.map((label) => (
          <div
            key={label}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ShieldCheck size={16} style={{ color: "var(--color-orange)" }} />
            <span className="font-heading text-sm font-bold uppercase tracking-wide">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
