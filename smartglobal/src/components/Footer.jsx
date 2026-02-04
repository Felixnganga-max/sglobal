import React from "react";
import {
  Mail,
  Phone,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";
import { assets } from "../assets/assets";

/**
 * Smart Global Footer
 * Colors: Red (#BF1A1A), Yellow (#FFD41D), Black, White, Brown (#7B4019)
 * White background with brand colors
 */

export default function Footer() {
  // Get current year dynamically
  const getCurrentYear = () => new Date().getFullYear();

  return (
    <footer className="py-12 px-4 bg-white">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12 xl:px-16">
        {/* Main Footer Content */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#FFD41D] bg-white shadow-xl">
          {/* Panel content */}
          <div className="relative z-10 px-8 py-10 sm:px-12 sm:py-14">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
              {/* Brand / Contact (left) */}
              <div className="space-y-6 md:col-span-2 lg:col-span-1">
                {/* Logo */}
                <div className="flex items-center gap-3">
                  <img
                    src={assets.logo}
                    alt="Smart Global"
                    className="h-12 w-auto"
                  />
                  <div>
                    <div
                      className="text-xl font-black text-gray-900 tracking-tighter"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      SMART GLOBAL
                    </div>
                    <div className="text-[10px] text-[#7B4019] font-bold tracking-[0.2em] -mt-1 uppercase">
                      Premium Foods
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                  Delivering premium quality food products to homes and
                  businesses. Committed to excellence, natural ingredients, and
                  authentic flavors.
                </p>

                {/* Contact Info */}
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#FFF8E1] border border-[#FFD41D]">
                      <Mail size={18} className="text-[#BF1A1A]" />
                    </span>
                    <a
                      href="mailto:info@smartglobal.com"
                      className="hover:text-[#BF1A1A] transition-colors font-semibold"
                      aria-label="Email info at smartglobal.com"
                    >
                      info@smartglobal.com
                    </a>
                  </li>

                  <li className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#FFF8E1] border border-[#FFD41D]">
                      <Phone size={18} className="text-[#BF1A1A]" />
                    </span>
                    <a
                      href="tel:+254700000000"
                      className="hover:text-[#BF1A1A] transition-colors font-semibold"
                      aria-label="Call +254 700 000 000"
                    >
                      +254 700 000 000
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column: Products */}
              <nav aria-label="Products" className="text-sm">
                <h3
                  className="mb-4 text-xs font-black text-[#BF1A1A] tracking-wider uppercase"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Products
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/products/toppings"
                      className="text-gray-700 hover:text-[#BF1A1A] transition-colors font-semibold"
                    >
                      Kent Toppings
                    </a>
                  </li>
                  <li>
                    <a
                      href="/products/spuds"
                      className="text-gray-700 hover:text-[#BF1A1A] transition-colors font-semibold"
                    >
                      SPUDS Chips
                    </a>
                  </li>
                  <li>
                    <a
                      href="/products/water"
                      className="text-gray-700 hover:text-[#BF1A1A] transition-colors font-semibold"
                    >
                      Kizembe Water
                    </a>
                  </li>
                  <li>
                    <a
                      href="/products/soups"
                      className="text-gray-700 hover:text-[#BF1A1A] transition-colors font-semibold"
                    >
                      Kent Soups & Spices
                    </a>
                  </li>
                  <li>
                    <a
                      href="/products"
                      className="text-gray-700 hover:text-[#BF1A1A] transition-colors font-semibold"
                    >
                      All Products
                    </a>
                  </li>
                </ul>
              </nav>

              {/* Column: Company */}
              <nav aria-label="Company" className="text-sm">
                <h3
                  className="mb-4 text-xs font-black text-[#BF1A1A] tracking-wider uppercase"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Company
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/about"
                      className="text-gray-700 hover:text-[#BF1A1A] transition-colors font-semibold"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/recipes"
                      className="text-gray-700 hover:text-[#BF1A1A] transition-colors font-semibold"
                    >
                      Recipes
                    </a>
                  </li>
                  <li>
                    <a
                      href="/blogs"
                      className="text-gray-700 hover:text-[#BF1A1A] transition-colors font-semibold"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="text-gray-700 hover:text-[#BF1A1A] transition-colors font-semibold"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="/careers"
                      className="text-gray-700 hover:text-[#BF1A1A] transition-colors font-semibold"
                    >
                      Careers
                    </a>
                  </li>
                </ul>
              </nav>

              {/* Column: Resources */}
              <nav aria-label="Resources" className="text-sm">
                <h3
                  className="mb-4 text-xs font-black text-[#BF1A1A] tracking-wider uppercase"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Resources
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/help"
                      className="text-gray-700 hover:text-[#BF1A1A] transition-colors font-semibold"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="/faq"
                      className="text-gray-700 hover:text-[#BF1A1A] transition-colors font-semibold"
                    >
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a
                      href="/quality"
                      className="text-gray-700 hover:text-[#BF1A1A] transition-colors font-semibold"
                    >
                      Quality Standards
                    </a>
                  </li>
                  <li>
                    <a
                      href="/certifications"
                      className="text-gray-700 hover:text-[#BF1A1A] transition-colors font-semibold"
                    >
                      Certifications
                    </a>
                  </li>
                  <li>
                    <a
                      href="/distributors"
                      className="text-gray-700 hover:text-[#BF1A1A] transition-colors font-semibold"
                    >
                      Become a Distributor
                    </a>
                  </li>
                </ul>
              </nav>

              {/* Column: Get in Touch - Far Right with Socials */}
              <div className="md:col-span-1 lg:col-span-1">
                <h3
                  className="mb-4 text-xs font-black text-[#BF1A1A] tracking-wider uppercase"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Connect With Us
                </h3>

                <div className="flex flex-col gap-3">
                  <SocialButton
                    icon={<Facebook size={18} />}
                    label="Facebook"
                    href="https://facebook.com/smartglobal"
                    ariaLabel="Follow us on Facebook"
                  />
                  <SocialButton
                    icon={<Instagram size={18} />}
                    label="Instagram"
                    href="https://instagram.com/smartglobal"
                    ariaLabel="Follow us on Instagram"
                  />
                  <SocialButton
                    icon={<Twitter size={18} />}
                    label="Twitter"
                    href="https://twitter.com/smartglobal"
                    ariaLabel="Follow us on Twitter"
                  />
                  <SocialButton
                    icon={<Linkedin size={18} />}
                    label="LinkedIn"
                    href="https://linkedin.com/company/smartglobal"
                    ariaLabel="Follow us on LinkedIn"
                  />
                </div>

                {/* Newsletter Signup */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-3 font-semibold">
                    Subscribe to our newsletter for updates and special offers.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#BF1A1A] focus:outline-none focus:ring-1 focus:ring-[#BF1A1A]"
                    />
                    <button className="px-4 py-2 bg-[#BF1A1A] text-white text-xs font-bold rounded-lg hover:bg-[#8B1414] transition-colors">
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-10 border-t-2 border-[#FFD41D]" />

            {/* Bottom legal row */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
              <div className="text-gray-600 font-semibold">
                © {getCurrentYear()} Smart Global Limited. All rights reserved.
              </div>
              <div className="flex gap-6 text-right">
                <a
                  href="/privacy"
                  className="text-gray-700 hover:text-[#BF1A1A] transition-colors font-semibold"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-gray-700 hover:text-[#BF1A1A] transition-colors font-semibold"
                >
                  Terms & Conditions
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Branding Strip */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Crafted with excellence by{" "}
            <span className="text-[#BF1A1A] font-bold">Smart Global</span> |
            Premium Food Products Since 2007
          </p>
        </div>
      </div>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;600;700;800;900&display=swap");
      `}</style>
    </footer>
  );
}

/* SocialButton: Brand-colored social media buttons */
function SocialButton({ icon, label, href = "#", ariaLabel }) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FFF8E1] border border-[#FFD41D] hover:bg-[#BF1A1A] hover:border-[#BF1A1A] transition-all duration-300"
    >
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white group-hover:bg-white/20 transition-colors">
        {React.cloneElement(icon, {
          className: "text-[#BF1A1A] group-hover:text-white transition-colors",
          size: 18,
        })}
      </span>
      <span className="text-sm text-gray-800 group-hover:text-white font-bold transition-colors">
        {label}
      </span>
    </a>
  );
}
