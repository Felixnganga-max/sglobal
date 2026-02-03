import React from "react";

/**
 * StatsBar.jsx
 * Small stats row used under the main content.
 */

export default function StatsBar() {
  const stats = [
    { value: "1K+", label: "Reviews" },
    { value: "3k+", label: "Best Sell" },
    { value: "150+", label: "Menu" },
  ];

  return (
    <div className="mt-6 rounded-xl bg-white p-6 border flex items-center justify-between">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="text-2xl font-semibold text-[var(--heading)]">
            {s.value}
          </div>
          <div className="text-sm text-[var(--muted)]">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
