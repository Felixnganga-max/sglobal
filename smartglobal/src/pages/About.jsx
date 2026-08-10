import React from "react";
import { Link } from "react-router-dom";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Package,
  Cookie,
  Droplet,
  ShieldCheck,
  Send,
} from "lucide-react";
import { assets } from "../assets/assets";

/* ── FAQ accordion item (kept from the original About page) ── */
function FaqItem({ faq }) {
  const [open, setOpen] = React.useState(false);
  const bodyRef = React.useRef(null);
  const innerRef = React.useRef(null);

  const toggle = () => {
    setOpen((prev) => !prev);
    if (bodyRef.current && innerRef.current) {
      bodyRef.current.style.maxHeight = open
        ? "0"
        : innerRef.current.scrollHeight + 32 + "px";
    }
  };

  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <button className="faq-btn" onClick={toggle} aria-expanded={open}>
        <span className="faq-q">{faq.q}</span>
        <span className="faq-icon">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke={open ? "#fff" : "#999"}
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="6" y1="1" x2="6" y2="11" />
            <line x1="1" y1="6" x2="11" y2="6" />
          </svg>
        </span>
      </button>
      <div className="faq-body" ref={bodyRef} style={{ maxHeight: 0 }}>
        <div className="faq-body-inner" ref={innerRef}>
          <span className={`faq-tag ${faq.tag}`}>{faq.label}</span>
          {faq.a}
        </div>
      </div>
    </div>
  );
}

const QUOTES = [
  {
    text: "Quality you can trust. Flavours you'll love.",
    source: "Smart Global Limited",
  },
  {
    text: "Bringing quality food and beverages to every table in Kenya.",
    source: "Smart Global Limited",
  },
];

const PRODUCT_GRID = [
  {
    icon: Package,
    title: "Kent Boringer",
    desc: "A household name since 2013 — soups, stock cubes & powder, sauces, syrups, pancake and muffin mixes, whipped cream and cream caramel.",
  },
  {
    icon: Cookie,
    title: "Spuds Craft Crisps",
    desc: "9 unique flavour profiles built on high quality, consistent potatoes and bold flavouring. Halal certified.",
  },
  {
    icon: Droplet,
    title: "Kizembe Spring Water",
    desc: "Natural spring water from Limuru, packaged in 300ml through 18.9L — fresh and pure for every occasion.",
  },
  {
    icon: ShieldCheck,
    title: "Quality & Safety",
    desc: "Every product moves through strict quality controls before it reaches supermarkets, retailers and the HORECA industry.",
  },
];

const FAQS = [
  {
    tag: "tag-water",
    label: "Kizembe",
    q: "Is Kizembe spring water safe to drink straight from the bottle?",
    a: "Yes. Kizembe is natural spring water sourced from Limuru and packaged under strict quality controls — it's ready to drink straight from the bottle with no treatment needed.",
  },
  {
    tag: "tag-water",
    label: "Kizembe",
    q: "What sizes does Kizembe spring water come in?",
    a: "Kizembe is available in 300ml, 500ml, 1L, 5L, 10L, and 18.9L — suitable for personal use, families, offices, and events of any size.",
  },
  {
    tag: "tag-spuds",
    label: "Spuds",
    q: "Are Spuds crisps suitable for people with dietary restrictions?",
    a: "Spuds craft crisps are Halal certified. We recommend checking individual packet labels for allergen information specific to each flavour profile.",
  },
  {
    tag: "tag-spuds",
    label: "Spuds",
    q: "How many flavours do Spuds crisps come in?",
    a: "Spuds currently offers 9 unique flavour profiles including Truffle Cheese, Hot Sriracha, Lime Fusion, Worcester Sauce, Sea Salt, Sweet Chili & Salsa, Sour Cream & Onion, CheeseTwist, and Prime Ribs.",
  },
  {
    tag: "tag-kent",
    label: "Kent",
    q: "Can Kent stock cubes and powders be used interchangeably?",
    a: "Both deliver rich, consistent flavour but serve slightly different purposes. Stock cubes are great for quick seasoning while stock powders are ideal for soups, stews, and recipes where you want to control the concentration.",
  },
  {
    tag: "tag-kent",
    label: "Kent",
    q: "What are Kent syrups and topping sauces best used for?",
    a: "Kent syrups — caramel, chocolate, and pancake — are perfect for beverages, desserts, and breakfast. The topping sauces work beautifully drizzled over ice cream, cakes, and plated desserts.",
  },
  {
    tag: "tag-kent",
    label: "Kent",
    q: "Do the Kent muffin and pancake mixes require special ingredients?",
    a: "No. The mixes are designed to be simple — you typically only need to add water, milk, or eggs. Full preparation instructions are printed clearly on each pack.",
  },
  {
    tag: "tag-gen",
    label: "General",
    q: "Where can I find Smart Global products if I don't order online?",
    a: "Our products are stocked countrywide in leading supermarkets and various retailers, and are also available across the HORECA sector — hotels, restaurants, and catering services throughout Kenya.",
  },
];

/*
 * ── Team section ──────────────────────────────────────────────
 * Commented out until real team photos are available. Uncomment
 * and fill in `photo` once we have them; keep the layout below.
 *
 * const TEAM = [
 *   { name: "", role: "", photo: "" },
 *   { name: "", role: "", photo: "" },
 *   { name: "", role: "", photo: "" },
 *   { name: "", role: "", photo: "" },
 *   { name: "", role: "", photo: "" },
 * ];
 *
 * <section className="page-x section-y">
 *   <div className="text-center max-w-xl mx-auto mb-12">
 *     <p className="text-eyebrow mb-2">Meet The Team</p>
 *     <h2
 *       className="font-heading font-bold"
 *       style={{
 *         fontSize: "clamp(1.4rem, 3vw, 2rem)",
 *         color: "var(--color-text)",
 *       }}
 *     >
 *       We work according to the specialization and expertise of the team
 *     </h2>
 *   </div>
 *   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 max-w-4xl mx-auto">
 *     {TEAM.map(({ name, role, photo }) => (
 *       <div key={name} className="text-center">
 *         <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3">
 *           <img src={photo} alt={name} className="w-full h-full object-cover" />
 *         </div>
 *         <p className="font-body font-bold text-sm" style={{ color: "var(--color-text)" }}>
 *           {name}
 *         </p>
 *         <p className="font-body text-xs" style={{ color: "var(--color-muted)" }}>
 *           {role}
 *         </p>
 *       </div>
 *     ))}
 *   </div>
 * </section>
 */

export default function About() {
  const [quoteIndex, setQuoteIndex] = React.useState(0);
  const [newsletterEmail, setNewsletterEmail] = React.useState("");

  const prevQuote = () =>
    setQuoteIndex((i) => (i === 0 ? QUOTES.length - 1 : i - 1));
  const nextQuote = () =>
    setQuoteIndex((i) => (i === QUOTES.length - 1 ? 0 : i + 1));

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert("Thanks for subscribing to Smart Global updates!");
    setNewsletterEmail("");
  };

  return (
    <main className="w-full bg-white">
      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="page-x pt-12 sm:pt-16 pb-10 sm:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
          {/* Left — heading + copy */}
          <div>
            <p className="text-eyebrow mb-3">Since 2007</p>
            <h1
              className="font-heading font-bold leading-tight"
              style={{
                fontSize: "clamp(1.9rem, 4vw, 3rem)",
                color: "var(--color-text)",
              }}
            >
              We bring quality food and beverages to every table in Kenya
            </h1>

            <p
              className="font-body text-sm leading-relaxed mt-5"
              style={{ color: "var(--color-muted)" }}
            >
              <span
                className="font-semibold"
                style={{ color: "var(--color-red)" }}
              >
                Smart Global Limited
              </span>{" "}
              started operations in 2007 with an assortment of commodities
              and has since become authorized importers and distributors
              for <span className="font-semibold">Kent Boringer</span> and{" "}
              <span className="font-semibold">Spuds</span>, and a local
              distributor for{" "}
              <span className="font-semibold">Kizembe spring water</span>.
              Our products are available countrywide in all leading
              supermarkets, various other retailers, and across the HORECA
              industry.
            </p>

            <div className="flex items-center gap-4 mt-8">
              <a
                href="#products"
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 hover:scale-105"
                style={{ backgroundColor: "var(--color-red)" }}
                aria-label="Learn more about Smart Global"
              >
                <Award size={22} color="#fff" />
              </a>
              <div>
                <p
                  className="font-body text-sm font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  Know more about us
                </p>
                <p
                  className="font-body text-xs"
                  style={{ color: "var(--color-muted)" }}
                >
                  Trusted quality since 2007
                </p>
              </div>
            </div>
          </div>

          {/* Right — image */}
          <div className="rounded-2xl overflow-hidden shadow-xl h-72 sm:h-96 lg:h-[28rem]">
            <img
              loading="lazy"
              decoding="async"
              src={assets.kent}
              alt="Smart Global products"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════ QUOTE + PRODUCT GRID (single red block) ══════════════════ */}
      <section style={{ backgroundColor: "var(--color-red)" }}>
        {/* Quote */}
        <div className="page-x pt-12 sm:pt-16 pb-10 max-w-3xl mx-auto text-center sm:text-left">
          <p className="font-heading font-bold text-white text-xl sm:text-2xl leading-snug">
            "{QUOTES[quoteIndex].text}"
          </p>
          <div className="flex items-center justify-center sm:justify-between mt-6 flex-wrap gap-4">
            <p className="font-body text-sm text-white/70">
              — {QUOTES[quoteIndex].source}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevQuote}
                aria-label="Previous"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <ChevronLeft size={16} color="#fff" />
              </button>
              <button
                type="button"
                onClick={nextQuote}
                aria-label="Next"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
                style={{ backgroundColor: "#fff" }}
              >
                <ChevronRight size={16} style={{ color: "var(--color-red)" }} />
              </button>
            </div>
          </div>
        </div>

        <div
          className="border-t mx-4 sm:mx-10 lg:mx-20"
          style={{ borderColor: "rgba(255,255,255,0.15)" }}
        />

        {/* Product grid */}
        <div id="products" className="page-x py-12 sm:py-16">
          <h2 className="font-heading font-bold text-white text-xl sm:text-2xl max-w-md mb-10">
            They like how we structure our product range
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 max-w-3xl">
            {PRODUCT_GRID.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <span
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <Icon size={17} color="#fff" />
                </span>
                <div>
                  <h3 className="font-heading font-bold text-white text-sm mb-1.5">
                    {title}
                  </h3>
                  <p className="font-body text-xs text-white/70 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ STATS + IMAGE ══════════════════════ */}
      <section
        className="page-x section-y"
        style={{ backgroundColor: "var(--color-bg-soft)" }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-heading font-bold mb-10"
            style={{
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              color: "var(--color-text)",
            }}
          >
            We've spent almost two decades growing trusted brands and
            product quality across Kenya
          </h2>

          <div className="flex flex-wrap gap-10 sm:gap-16 mb-10">
            <div>
              <p
                className="font-heading font-bold"
                style={{ fontSize: "2.75rem", color: "var(--color-red)" }}
              >
                19+
              </p>
              <p
                className="font-body text-sm"
                style={{ color: "var(--color-muted)" }}
              >
                Years serving Kenyan homes and businesses
              </p>
            </div>
            <div>
              <p
                className="font-heading font-bold"
                style={{ fontSize: "2.75rem", color: "var(--color-red)" }}
              >
                3
              </p>
              <p
                className="font-body text-sm"
                style={{ color: "var(--color-muted)" }}
              >
                Trusted brand partnerships nationwide
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg h-64 sm:h-80">
            <img
              loading="lazy"
              decoding="async"
              src={assets.recipe}
              alt="Smart Global products in use"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════ FAQ ══════════════════════ */}
      <section
        className="page-x section-y"
        style={{ backgroundColor: "#f7f5f3" }}
      >
        <style>{`
          .faq-item { background:#fff; border:1px solid #ebebeb; border-radius:14px; overflow:hidden; transition:border-color 0.25s, box-shadow 0.25s; margin-bottom:10px; }
          .faq-item.open { border-color:var(--color-red); box-shadow:0 0 0 3px rgba(255,0,0,0.06); }
          .faq-btn { width:100%; display:flex; align-items:center; justify-content:space-between; gap:16px; padding:18px 20px; background:none; border:none; cursor:pointer; text-align:left; font-family:inherit; }
          .faq-q { font-size:14px; font-weight:600; color:#1a1a1a; line-height:1.5; flex:1; transition:color 0.2s; }
          .faq-item.open .faq-q, .faq-btn:hover .faq-q { color:var(--color-red); }
          .faq-icon { width:28px; height:28px; border-radius:50%; border:1.5px solid #e0e0e0; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background 0.25s, border-color 0.25s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1); }
          .faq-item.open .faq-icon { background:var(--color-red); border-color:var(--color-red); transform:rotate(45deg); }
          .faq-body { max-height:0; overflow:hidden; transition:max-height 0.4s cubic-bezier(0.4,0,0.2,1); }
          .faq-body-inner { padding:14px 20px 20px; font-size:13px; color:#666; line-height:1.75; border-top:1px solid #f2f2f2; }
          .faq-tag { display:inline-block; font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:2px 8px; border-radius:20px; margin-right:6px; margin-bottom:10px; }
          .tag-water { background:#e6f1fb; color:#185FA5; }
          .tag-spuds { background:#fef2f2; color:#A32D2D; }
          .tag-kent  { background:#faeeda; color:#633806; }
          .tag-gen   { background:#f1efe8; color:#5F5E5A; }
        `}</style>

        <div className="mb-10 text-center">
          <p className="text-eyebrow mb-2">Got questions?</p>
          <h2
            className="font-heading font-bold"
            style={{
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              color: "var(--color-text)",
            }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mx-auto max-w-3xl">
          {FAQS.map((faq, i) => (
            <FaqItem key={i} faq={faq} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/products" className="btn-primary">
            See Our Products
          </Link>
        </div>
      </section>

      {/* ══════════════════════ TEAM (commented out — pending photos) ══════════════════════ */}

      {/* ══════════════════════ NEWSLETTER ══════════════════════ */}
      <section
        className="page-x py-14 sm:py-16 text-center"
        style={{ backgroundColor: "var(--color-red)" }}
      >
        <div className="max-w-lg mx-auto">
          <h2 className="font-heading font-bold text-white text-2xl sm:text-3xl mb-2">
            Add your email to get our weekly updates
          </h2>
          <p className="font-body text-sm text-white/70 mb-7">
            Product news, recipes and stories from Smart Global — straight
            to your inbox.
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="your@email.com"
              className="font-body text-sm flex-1 px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.25)" }}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white font-body font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-transform duration-200 hover:scale-[1.03]"
              style={{ color: "var(--color-red)" }}
            >
              Subscribe
              <Send size={13} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
