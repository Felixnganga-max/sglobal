import React from "react";
import { MessageCircle, Mail } from "lucide-react";

export default function Contact() {
  return (
    <section className="page-x section-y">
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--color-red) 0%, var(--color-red-dark) 60%, #5a0a0a 100%)",
        }}
      >
        {/* Decorative arc — right side */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-end pointer-events-none"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 400 400"
            className="h-full w-auto opacity-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(380,200)">
              {[320, 260, 200, 140, 80].map((r, i) => (
                <path
                  key={r}
                  d={`M${r},0 A${r},${r} 0 0,1 0,${r} L0,0 Z`}
                  fill={i % 2 === 0 ? "#FFD41D" : "#ffffff"}
                  opacity={0.6 - i * 0.08}
                />
              ))}
            </g>
          </svg>
        </div>

        {/* Corner accents */}
        <div className="absolute top-5 right-5 w-12 h-12 border-t border-r border-white/10 rounded-tr-xl" />
        <div className="absolute bottom-5 left-5 w-12 h-12 border-b border-l border-white/10 rounded-bl-xl" />

        {/* Content */}
        <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-14 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left — text + CTAs */}
            <div className="max-w-xl">
              {/* Eyebrow */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--color-orange)" }}
                />
                <span className="font-body text-white/80 text-[0.6rem] font-bold uppercase tracking-[0.2em]">
                  Get in Touch
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-hero text-white leading-tight">
               Place your order
               
              </h2>

              <p className="font-body text-sm text-white/75 mt-4 leading-relaxed max-w-md">
                Get Smart Global premium products delivered to your doorstep.
                Order via WhatsApp for instant service, or email us for bulk
                orders.
              </p>

              {/* CTAs */}
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/254700000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Order via WhatsApp"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-bold text-white text-xs uppercase tracking-widest transition-all duration-200 hover:scale-105 hover:brightness-110"
                  style={{
                    backgroundColor: "#25D366",
                    boxShadow: "0 4px 14px rgba(37,211,102,0.35)",
                  }}
                >
                  <MessageCircle size={14} />
                  WhatsApp Order
                </a>
                <a
                  href="mailto:orders@smartglobal.co.ke"
                  aria-label="Email your order"
                  className="btn-white inline-flex items-center gap-2"
                  style={{ fontSize: "0.65rem" }}
                >
                  <Mail size={14} />
                  Email Order
                </a>
              </div>

              {/* Contact meta */}
              <div className="mt-6 flex flex-wrap gap-5">
                {[
                  { icon: MessageCircle, text: "+254 700 000 000" },
                  { icon: Mail, text: "orders@smartglobal.co.ke" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon size={13} style={{ color: "var(--color-orange)" }} />
                    <span className="font-body text-xs text-white/70 font-medium">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual accent */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative flex items-center justify-center w-72 h-72">
                {/* Pulsing rings */}
                {[140, 110, 80, 50].map((r, i) => (
                  <div
                    key={r}
                    className="absolute rounded-full"
                    style={{
                      width: r * 2,
                      height: r * 2,
                      border: `1px solid rgba(255,212,29,${0.08 + i * 0.06})`,
                    }}
                  />
                ))}
                {/* Centre glow */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,212,29,0.35) 0%, transparent 70%)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{
                      backgroundColor: "rgba(255,212,29,0.5)",
                      boxShadow: "0 0 24px rgba(255,212,29,0.6)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
