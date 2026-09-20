import React from "react";
import { Truck, Shield, Zap } from "lucide-react";

// Same three badges the old hero showed.
const TRUST_BADGES = [
  { icon: Truck, label: "Free Delivery", sub: "Over Ksh 5,000" },
  { icon: Shield, label: "Quality Assured", sub: "Premium products" },
  { icon: Zap, label: "Fast Processing", sub: "Same day dispatch" },
];

const CSS = `
  .ns-trust {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem;
    padding: 1rem 1.25rem; border-radius: 22px; background: var(--color-blue-tint);
  }
  @media (max-width: 640px) { .ns-trust { grid-template-columns: 1fr; } }
  .ns-trust-item { display: flex; align-items: center; gap: 12px; }
  .ns-trust-icon {
    width: 40px; height: 40px; flex-shrink: 0; border-radius: 50%; background: #fff;
    display: flex; align-items: center; justify-content: center; color: var(--color-blue);
  }
  .ns-trust-label { display: block; font-family: var(--font-body); font-size: 0.78rem; font-weight: 700; color: var(--color-text); line-height: 1.25; }
  .ns-trust-sub { display: block; font-family: var(--font-body); font-size: 0.66rem; color: var(--color-muted); }
`;

export default function TrustBar() {
  return (
    <section aria-label="Why shop with us" className="ns-trust">
      <style>{CSS}</style>
      {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
        <div key={label} className="ns-trust-item">
          <span className="ns-trust-icon">
            <Icon size={18} />
          </span>
          <div>
            <span className="ns-trust-label">{label}</span>
            <span className="ns-trust-sub">{sub}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
