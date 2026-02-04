import React from "react";
import { MessageCircle, Mail } from "lucide-react";

/**
 * Contact Component - Smart Global Premium Foods
 *
 * Features:
 * - Large rounded panel with Smart Global brand colors
 * - WhatsApp and Email order CTAs
 * - Enlarged pyramid/arc design on the right
 * - Modern glass morphism effects
 */
export default function Contact() {
  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white py-16 px-6 lg:px-12">
      {/* Outer frame */}
      <div className="w-full max-w-[1600px] mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#BF1A1A] to-[#8B1414] overflow-hidden shadow-2xl">
          {/* Inner glow border effect */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            aria-hidden="true"
          >
            <div className="m-4 rounded-2xl bg-white/5 h-full backdrop-blur-sm" />
          </div>

          <div className="relative px-8 py-16 md:px-12 md:py-20 lg:px-16 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left column: text + CTAs */}
              <div className="max-w-2xl z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                  <div className="w-2 h-2 bg-[#FFD41D] rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-xs font-bold uppercase tracking-wider">
                    Get in Touch
                  </span>
                </div>

                <h2
                  className="text-white text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  ORDER YOUR
                  <br />
                  <span className="text-[#FFD41D]">PREMIUM FOODS</span>
                </h2>

                <p className="mt-6 text-white/90 text-base sm:text-lg max-w-xl leading-relaxed font-semibold">
                  Get Smart Global premium products delivered to your doorstep.
                  Order via WhatsApp for instant service or email us your bulk
                  orders.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
                  <ActionPill
                    ariaLabel="Order via WhatsApp"
                    icon={<MessageCircle size={20} />}
                    type="whatsapp"
                  >
                    Order via WhatsApp
                  </ActionPill>

                  <ActionPill
                    ariaLabel="Email your order"
                    icon={<Mail size={20} />}
                    type="email"
                  >
                    Email Your Order
                  </ActionPill>
                </div>

                {/* Contact Info */}
                <div className="mt-8 flex flex-wrap gap-6 text-white/80 text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <MessageCircle size={16} className="text-[#FFD41D]" />
                    <span>+254 700 000 000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-[#FFD41D]" />
                    <span>orders@smartglobal.co.ke</span>
                  </div>
                </div>
              </div>

              {/* Right column: enlarged pyramid/concentric arcs */}
              <div className="flex justify-end lg:justify-center">
                <svg
                  className="w-full max-w-2xl h-72 sm:h-96 lg:h-[500px]"
                  viewBox="0 0 700 700"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id="gradA"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#FFD41D" stopOpacity="0.4" />
                      <stop
                        offset="100%"
                        stopColor="#ffffff"
                        stopOpacity="0.1"
                      />
                    </linearGradient>

                    <linearGradient
                      id="gradB"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                      <stop
                        offset="100%"
                        stopColor="#FFD41D"
                        stopOpacity="0.05"
                      />
                    </linearGradient>

                    <radialGradient id="radialGlow">
                      <stop offset="0%" stopColor="#FFD41D" stopOpacity="0.8" />
                      <stop
                        offset="50%"
                        stopColor="#ffffff"
                        stopOpacity="0.4"
                      />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Concentric arcs - enlarged and positioned */}
                  <g transform="translate(400,350)">
                    {/* Outermost arc - largest */}
                    <path
                      d="M320,0 A320,320 0 0,1 0,320 L0,0 Z"
                      fill="url(#gradA)"
                      opacity="0.2"
                    />

                    {/* Second arc */}
                    <path
                      d="M260,0 A260,260 0 0,1 0,260 L0,0 Z"
                      fill="url(#gradB)"
                      opacity="0.25"
                    />

                    {/* Third arc */}
                    <path
                      d="M200,0 A200,200 0 0,1 0,200 L0,0 Z"
                      fill="#ffffff"
                      opacity="0.15"
                    />

                    {/* Fourth arc */}
                    <path
                      d="M140,0 A140,140 0 0,1 0,140 L0,0 Z"
                      fill="#ffffff"
                      opacity="0.20"
                    />

                    {/* Fifth arc */}
                    <path
                      d="M80,0 A80,80 0 0,1 0,80 L0,0 Z"
                      fill="#FFD41D"
                      opacity="0.30"
                    />

                    {/* Central glowing circle */}
                    <circle cx="0" cy="0" r="40" fill="url(#radialGlow)" />

                    {/* Inner bright circle */}
                    <circle cx="0" cy="0" r="25" fill="#FFD41D" opacity="0.9" />

                    {/* Core white dot */}
                    <circle
                      cx="0"
                      cy="0"
                      r="12"
                      fill="#ffffff"
                      opacity="0.95"
                    />
                  </g>

                  {/* Additional decorative elements */}
                  <g transform="translate(400,350)" opacity="0.1">
                    <circle
                      cx="0"
                      cy="0"
                      r="380"
                      stroke="#ffffff"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="420"
                      stroke="#FFD41D"
                      strokeWidth="1"
                      fill="none"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom highlight */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            aria-hidden="true"
          >
            <div className="absolute left-0 right-0 bottom-0 h-4 bg-white/5 rounded-b-3xl" />
          </div>

          {/* Decorative corner elements */}
          <div className="absolute top-8 right-8 w-20 h-20 border-t-2 border-r-2 border-white/10 rounded-tr-3xl"></div>
          <div className="absolute bottom-8 left-8 w-20 h-20 border-b-2 border-l-2 border-white/10 rounded-bl-3xl"></div>
        </div>
      </div>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;600;700;800;900&display=swap");
      `}</style>
    </div>
  );
}

/**
 * ActionPill - Smart Global styled CTA buttons
 *
 * WhatsApp green or Email white styling with shiny knob
 */
function ActionPill({ children, ariaLabel, icon, type }) {
  const isWhatsApp = type === "whatsapp";

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`group relative inline-flex items-center justify-between gap-4 px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-base ${
        isWhatsApp
          ? "bg-[#25D366] hover:bg-[#20BA5A] text-white"
          : "bg-white hover:bg-gray-50 text-[#BF1A1A]"
      }`}
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <span className="flex items-center gap-3">
        {icon}
        <span className="uppercase tracking-wide">{children}</span>
      </span>

      {/* Circular shiny knob */}
      <span
        className={`ml-4 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
          isWhatsApp
            ? "bg-gradient-to-br from-white/30 to-white/10"
            : "bg-gradient-to-br from-[#FFD41D] to-[#BF1A1A]"
        }`}
        aria-hidden="true"
      >
        <span
          className={`block w-4 h-4 rounded-full ${
            isWhatsApp ? "bg-white" : "bg-white"
          }`}
        />
      </span>
    </button>
  );
}
