import React from "react";
import {
  Mail,
  Phone,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-950 text-white">
      {/* ── Top accent bar ── */}
      <div
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(to right, var(--color-red), var(--color-orange), var(--color-red))",
        }}
      />

      {/* ── Main body ── */}
      <div className="page-x section-y">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <img
                src={assets.logo}
                alt="Smart Global"
                className="h-10 w-auto brightness-0 invert"
              />
              <div>
                <div className="font-heading text-xl font-bold tracking-wider text-white">
                  SMART GLOBAL
                </div>
                <div
                  className="font-body text-[0.6rem] font-bold tracking-[0.25em] uppercase"
                  style={{ color: "var(--color-orange)" }}
                >
                  Premium Foods
                </div>
              </div>
            </div>

            <p className="font-body text-sm leading-relaxed text-gray-400 max-w-xs">
              Delivering premium quality food products to homes and businesses
              across Kenya. Committed to excellence, natural ingredients, and
              authentic flavours.
            </p>

            {/* Contact */}
            <ul className="space-y-3">
              {[
                {
                  icon: Mail,
                  text: "info@smartglobal.com",
                  href: "mailto:info@smartglobal.com",
                },
                {
                  icon: Phone,
                  text: "+254 140 252 223",
                  href: "tel:+254140252223",
                },
              ].map(({ icon: Icon, text, href }) => (
                <li key={href}>
                  <a href={href} className="flex items-center gap-3 group">
                    <span
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                      style={{
                        backgroundColor: "rgba(255,127,17,0.12)",
                        border: "1px solid rgba(255,127,17,0.25)",
                      }}
                    >
                      <Icon
                        size={15}
                        style={{ color: "var(--color-orange)" }}
                      />
                    </span>
                    <span className="font-body text-sm text-gray-400 group-hover:text-white transition-colors duration-200 font-medium">
                      {text}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Socials */}
            <div className="flex gap-2 pt-1">
              {[
                {
                  Icon: Facebook,
                  href: "https://facebook.com/smartglobal",
                  label: "Facebook",
                },
                {
                  Icon: Instagram,
                  href: "https://instagram.com/smartglobal",
                  label: "Instagram",
                },
                {
                  Icon: Twitter,
                  href: "https://twitter.com/smartglobal",
                  label: "Twitter",
                },
                {
                  Icon: Linkedin,
                  href: "https://linkedin.com/company/smartglobal",
                  label: "LinkedIn",
                },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-red)";
                    e.currentTarget.style.borderColor = "var(--color-red)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  <Icon
                    size={15}
                    className="text-gray-400 group-hover:text-white"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {[
            {
              title: "Products",
              links: [
                { label: "Kent Toppings", to: "/products/toppings" },
                { label: "SPUDS Chips", to: "/products/spuds" },
                { label: "Kizembe Water", to: "/products/water" },
                { label: "Kent Soups & Spices", to: "/products/soups" },
                { label: "All Products", to: "/products" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About Us", to: "/about" },
                { label: "Recipes", to: "/recipes" },
                { label: "Blog", to: "/blogs" },
                { label: "Contact", to: "/contact" },
                { label: "Careers", to: "/careers" },
              ],
            },
            {
              title: "Resources",
              links: [
                { label: "Help Center", to: "/help" },
                { label: "FAQ", to: "/faq" },
                { label: "Quality Standards", to: "/quality" },
                { label: "Certifications", to: "/certifications" },
                { label: "Become a Distributor", to: "/distributors" },
              ],
            },
          ].map(({ title, links }) => (
            <nav key={title} aria-label={title}>
              <h3 className="text-eyebrow mb-4">{title}</h3>
              <div className="section-rule-orange mb-4" />
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="font-body text-sm text-gray-400 hover:text-white transition-colors duration-200 font-medium flex items-center gap-1.5 group"
                    >
                      <span
                        className="w-1 h-1 rounded-full flex-shrink-0 transition-all duration-200 group-hover:w-2"
                        style={{ backgroundColor: "var(--color-orange)" }}
                      />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Newsletter */}
        <div
          className="mt-12 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,0,0,0.12) 0%, rgba(255,127,17,0.08) 100%)",
            border: "1px solid rgba(255,127,17,0.2)",
          }}
        >
          <div>
            <p className="text-eyebrow mb-1">Stay Updated</p>
            <h4 className="font-heading text-white font-bold text-lg">
              Get exclusive deals & recipes
            </h4>
            <p className="font-body text-xs text-gray-400 mt-1">
              Join 5,000+ subscribers.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="font-body text-sm flex-1 sm:w-56 px-4 py-2.5 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition-colors"
              style={{ borderColor: "rgba(255,127,17,0.3)" }}
            />
            <button
              className="btn-secondary px-5 py-2.5 whitespace-nowrap"
              style={{ fontSize: "0.65rem" }}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mt-10 border-t"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        />

        {/* Bottom row */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-body text-xs text-gray-500">
            © {year} Smart Global Limited. All rights reserved. · Premium Food
            Products Since 2007
          </p>
          <div className="flex gap-5">
            {[
              { label: "Privacy Policy", to: "/privacy" },
              { label: "Terms & Conditions", to: "/terms" },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="font-body text-xs text-gray-500 hover:text-white transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
