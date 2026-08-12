import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  ShoppingBag,
  Truck,
  ShieldCheck,
  CreditCard,
  Wrench,
  ChevronDown,
  Sparkles,
  Coffee,
  Heart,
  Star,
  Smile,
  Droplet,
  BookOpen,
  Package,
  Newspaper,
  Send,
} from "lucide-react";
import { assets } from "../assets/assets";

/* ── Small underline "fill in the blank" input, used inside the mad-lib form ── */
function Blank({ as = "input", ...props }) {
  const shared = {
    className:
      "inline-block bg-transparent border-0 border-b-2 outline-none font-body font-semibold px-1 pb-0.5 align-baseline transition-colors duration-200",
    style: { borderColor: "var(--color-border)", color: "var(--color-text)" },
    onFocus: (e) => {
      e.target.style.borderColor = "var(--color-blue)";
    },
    onBlur: (e) => {
      e.target.style.borderColor = "var(--color-border)";
    },
    ...props,
  };
  if (as === "select") return <select {...shared}>{props.children}</select>;
  if (as === "textarea") return <textarea {...shared} />;
  return <input {...shared} />;
}

/* ── FAQ accordion item ── */
function FaqRow({ q, a, open, onToggle }) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-colors duration-200"
      style={{ border: "1px solid var(--color-border)" }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        style={{ backgroundColor: open ? "var(--color-bg-soft)" : "#fff" }}
      >
        <span
          className="font-body font-bold text-sm"
          style={{ color: "var(--color-text)" }}
        >
          {q}
        </span>
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300"
          style={{
            backgroundColor: "var(--color-blue-tint)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <ChevronDown size={14} style={{ color: "var(--color-blue)" }} />
        </span>
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p
            className="font-body text-sm leading-relaxed px-5 pb-4"
            style={{ color: "var(--color-muted)" }}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

const FAQS = [
  {
    q: "What products does Smart Global distribute?",
    a: "We're authorized importers and distributors for Kent Boringer and Spuds, and the local distributor for Kizembe spring water — alongside our own range of toppings, soups and spices.",
  },
  {
    q: "Where can I buy Smart Global products?",
    a: "Our products are available countrywide in all leading supermarkets, various other retailers, and across the HORECA industry. Reach out and we'll point you to the nearest stockist.",
  },
  {
    q: "Do you supply restaurants, hotels and caterers?",
    a: "Yes — we work closely with the HORECA industry across Kenya. Use the form below or email us for bulk pricing and wholesale supply arrangements.",
  },
  {
    q: "How can I become a Smart Global distributor?",
    a: "We're always open to new distribution partnerships. Tell us about your business through the form below and our team will follow up with the details.",
  },
  {
    q: "How quickly will I get a response?",
    a: "Our support team responds within 24 hours, and usually much sooner during office hours — Monday to Saturday, 8:00 AM to 6:00 PM EAT.",
  },
];

const NEED_CARDS = [
  {
    icon: Truck,
    title: "Orders & Delivery",
    desc: "Track an order, ask about delivery areas, or change a pending request.",
  },
  {
    icon: ShieldCheck,
    title: "Product Quality & Safety",
    desc: "Questions about ingredients, freshness, or how we handle quality checks.",
  },
  {
    icon: CreditCard,
    title: "Payments & Billing",
    desc: "Help with invoices, wholesale pricing, or a payment that didn't go through.",
  },
  {
    icon: Wrench,
    title: "Technical Support",
    desc: "Trouble with the website, your account, or placing an order online.",
  },
];

const TOOLS = [
  {
    image: assets.recipe,
    icon: BookOpen,
    title: "Browse Recipes",
    desc: "Get inspired with recipes built around our products.",
    to: "/recipes",
  },
  {
    image: assets.kent,
    icon: Package,
    title: "Explore Products",
    desc: "See the full Smart Global range, from toppings to spring water.",
    to: "/products",
  },
  {
    image: assets.spuds1,
    icon: Newspaper,
    title: "Read the Blog",
    desc: "Tips, news and stories from the Smart Global kitchen.",
    to: "/blogs",
  },
];

const AVATAR_BUBBLES = [
  { icon: Coffee, top: "6%", left: "10%" },
  { icon: ShoppingBag, top: "18%", left: "88%" },
  { icon: Heart, top: "58%", left: "4%" },
  { icon: Star, top: "72%", left: "92%" },
  { icon: Smile, top: "2%", left: "48%" },
  { icon: Droplet, top: "80%", left: "40%" },
];

export default function ContactUs() {
  const [form, setForm] = React.useState({
    name: "",
    role: "Customer",
    location: "",
    message: "",
    email: "",
    phone: "",
  });
  const [openFaq, setOpenFaq] = React.useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting Smart Global! We'll get back to you soon.");
    setForm({
      name: "",
      role: "Customer",
      location: "",
      message: "",
      email: "",
      phone: "",
    });
  };

  return (
    <main className="w-full bg-white overflow-hidden">
      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative page-x pt-10 sm:pt-14 pb-6">
        {/* Floating decorative bubbles */}
        <div
          className="absolute inset-0 hidden lg:block pointer-events-none"
          aria-hidden="true"
        >
          {AVATAR_BUBBLES.map(({ icon: Icon, top, left }, i) => (
            <div
              key={i}
              className="absolute w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
              style={{
                top,
                left,
                backgroundColor: "#fff",
                border: "1px solid var(--color-border)",
                animation: `floatY 4s ease-in-out ${i * 0.4}s infinite`,
              }}
            >
              <Icon size={16} style={{ color: "var(--color-orange)" }} />
            </div>
          ))}
        </div>

        <div className="relative max-w-2xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
            style={{
              backgroundColor: "rgba(255,127,17,0.1)",
              border: "1px solid rgba(255,127,17,0.25)",
            }}
          >
            <Sparkles size={12} style={{ color: "var(--color-orange)" }} />
            <span
              className="font-body text-[0.6rem] font-bold uppercase tracking-widest"
              style={{ color: "var(--color-orange)" }}
            >
              We're Here to Help
            </span>
          </div>

          <h1 className="text-hero" style={{ color: "var(--color-text)" }}>
            Your Questions Deserve{" "}
            <span style={{ color: "var(--color-orange)" }}>Real Support</span>
          </h1>

          <p
            className="font-body text-sm sm:text-base leading-relaxed mt-4 max-w-lg mx-auto"
            style={{ color: "var(--color-muted)" }}
          >
            From orders and deliveries to product questions and distributor
            partnerships — the Smart Global team is one message away.
          </p>

          <a href="#reach-out" className="btn-secondary inline-flex items-center gap-2 mt-6">
            Reach Our Team
            <ArrowRight size={13} />
          </a>
        </div>

        {/* Image band with floating stat card */}
        <div className="relative mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-0 items-center max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden h-52 sm:h-64 lg:h-72 lg:mr-[-1.5rem] relative z-0 shadow-lg">
            <img
              loading="lazy"
              decoding="async"
              src={assets.topping}
              alt="Smart Global product"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 flex justify-center">
            <div
              className="w-full max-w-[15rem] rounded-2xl p-5 shadow-2xl bg-white lg:-mt-4"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <p className="text-eyebrow mb-3">Support at a Glance</p>
              <div className="space-y-3">
                {[
                  { icon: Clock, label: "Avg. Response Time", value: "< 2 hrs" },
                  { icon: Smile, label: "Satisfaction Rate", value: "98%" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(255,127,17,0.1)" }}
                    >
                      <Icon size={13} style={{ color: "var(--color-orange)" }} />
                    </span>
                    <div>
                      <p
                        className="font-body text-[0.6rem]"
                        style={{ color: "var(--color-muted)" }}
                      >
                        {label}
                      </p>
                      <p
                        className="font-body text-sm font-bold"
                        style={{ color: "var(--color-text)" }}
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-end gap-1 mt-4 h-8">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{ height: `${h}%`, backgroundColor: "var(--color-orange)", opacity: 0.35 + i * 0.08 }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden h-52 sm:h-64 lg:h-72 lg:ml-[-1.5rem] relative z-0 shadow-lg">
            <img
              loading="lazy"
              decoding="async"
              src={assets.water}
              alt="Kizembe spring water"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════ FIND WHAT YOU NEED FASTER ══════════════════════ */}
      <section
        className="relative page-x section-y mt-10"
        style={{ backgroundColor: "var(--color-blue)" }}
      >
        <div className="text-center max-w-xl mx-auto mb-10">
          <p
            className="font-body text-[0.6rem] font-bold uppercase tracking-widest mb-2"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            How Can We Help
          </p>
          <h2 className="font-heading font-bold text-white text-2xl sm:text-3xl uppercase tracking-wide">
            Find What You Need Faster
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {NEED_CARDS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl p-6"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <span
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "rgba(255,127,17,0.18)" }}
              >
                <Icon size={18} style={{ color: "var(--color-orange)" }} />
              </span>
              <h3 className="font-heading font-bold text-white text-sm mb-1.5">
                {title}
              </h3>
              <p className="font-body text-xs text-white/60 leading-relaxed mb-4">
                {desc}
              </p>
              <a
                href="#reach-out"
                className="inline-flex items-center gap-1.5 font-body text-[0.65rem] font-bold uppercase tracking-widest"
                style={{ color: "var(--color-orange)" }}
              >
                Get Support
                <ArrowRight size={11} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════ REACH OUT YOUR WAY ══════════════════════ */}
      <section id="reach-out" className="page-x section-y">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          {/* Left — heading + quick contacts */}
          <div>
            <p className="text-eyebrow mb-2">Get In Touch</p>
            <h2
              className="font-heading font-bold mb-3"
              style={{
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                color: "var(--color-text)",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Reach Out Your Way
            </h2>
            <p
              className="font-body text-sm leading-relaxed mb-7"
              style={{ color: "var(--color-muted)" }}
            >
              Have more questions? Tell us a bit about yourself and what you
              need — or contact us directly through the channel that suits
              you best.
            </p>

            <ul className="space-y-3">
              {[
                {
                  icon: Mail,
                  title: "Email Support",
                  text: "info@smartgloballtd.com",
                  href: "mailto:info@smartgloballtd.com",
                  accent: "var(--color-blue)",
                  tint: "var(--color-blue-tint)",
                },
                {
                  icon: MapPin,
                  title: "Visit Our Office",
                  text: "Nairobi Business District, Kenya",
                  href: "#",
                  accent: "var(--color-orange)",
                  tint: "rgba(255,127,17,0.1)",
                },
                {
                  icon: Phone,
                  title: "Call Us Directly",
                  text: "+254 700 826 813",
                  href: "tel:+254700826813",
                  accent: "var(--color-red)",
                  tint: "rgba(255,0,0,0.08)",
                },
              ].map(({ icon: Icon, title, text, href, accent, tint }) => (
                <li key={title}>
                  <a
                    href={href}
                    className="flex items-center gap-4 p-3.5 rounded-xl transition-all duration-200 group"
                    style={{
                      backgroundColor: "var(--color-bg-soft)",
                      border: "1px solid var(--color-border)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                    }}
                  >
                    <span
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: tint }}
                    >
                      <Icon size={15} style={{ color: accent }} />
                    </span>
                    <div>
                      <p
                        className="font-body text-xs font-bold"
                        style={{ color: "var(--color-text)" }}
                      >
                        {title}
                      </p>
                      <p
                        className="font-body text-xs font-semibold"
                        style={{ color: accent }}
                      >
                        {text}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>

            <div
              className="flex items-center gap-2 mt-6 pt-5 border-t font-body"
              style={{ borderColor: "var(--color-border)" }}
            >
              <Clock size={13} style={{ color: "var(--color-orange)" }} />
              <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                Office Hours: Monday – Saturday, 8:00 AM – 6:00 PM EAT · Expected
                response within{" "}
                <span className="font-bold" style={{ color: "var(--color-orange)" }}>
                  24 hours
                </span>
              </span>
            </div>
          </div>

          {/* Right — mad-lib style form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-6 sm:p-8"
            style={{
              backgroundColor: "var(--color-bg-soft)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="font-body text-lg sm:text-xl leading-relaxed"
              style={{ color: "var(--color-text)" }}
            >
              Hi, I'm{" "}
              <Blank
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="your name"
                required
                style={{ width: "9rem" }}
              />
              , a{" "}
              <Blank as="select" name="role" value={form.role} onChange={handleChange}>
                <option>Customer</option>
                <option>Retailer</option>
                <option>Distributor</option>
                <option>Restaurant / HORECA</option>
              </Blank>{" "}
              from{" "}
              <Blank
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="your city"
                required
                style={{ width: "8rem" }}
              />
              {" "}that needs help.
            </p>

            <p
              className="font-body text-lg sm:text-xl leading-relaxed mt-5"
              style={{ color: "var(--color-text)" }}
            >
              My question is about{" "}
              <Blank
                as="textarea"
                name="message"
                rows={2}
                value={form.message}
                onChange={handleChange}
                placeholder="tell us what's on your mind"
                required
                style={{ width: "100%", resize: "none", marginTop: "0.5rem" }}
              />
            </p>

            <p
              className="font-body text-lg sm:text-xl leading-relaxed mt-5"
              style={{ color: "var(--color-text)" }}
            >
              You can reach me at{" "}
              <Blank
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@email.com"
                required
                style={{ width: "12rem" }}
              />{" "}
              or{" "}
              <Blank
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0700 000 000"
                style={{ width: "9rem" }}
              />{" "}
              to get things started.
            </p>

            <button
              type="submit"
              className="btn-blue inline-flex items-center gap-2 mt-7"
            >
              Submit
              <Send size={13} />
            </button>
          </form>
        </div>
      </section>

      {/* ══════════════════════ FAQ ══════════════════════ */}
      <section className="page-x section-y">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 max-w-4xl mx-auto">
          <div>
            <p className="text-eyebrow mb-2">Got Questions?</p>
            <h2
              className="font-heading font-bold"
              style={{
                fontSize: "clamp(1.3rem, 2.8vw, 1.9rem)",
                color: "var(--color-text)",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              You Have Questions,{" "}
              <span style={{ color: "var(--color-blue)" }}>We Have Answers</span>
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FaqRow
                key={faq.q}
                q={faq.q}
                a={faq.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ TOOLS TO GUIDE YOU ══════════════════════ */}
      <section className="page-x section-y" style={{ backgroundColor: "var(--color-bg-soft)" }}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 max-w-5xl mx-auto mb-8">
          <div>
            <p className="text-eyebrow mb-2">Resource Library</p>
            <h2
              className="font-heading font-bold"
              style={{
                fontSize: "clamp(1.3rem, 2.8vw, 1.9rem)",
                color: "var(--color-text)",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Tools to Guide You
            </h2>
          </div>
          <p
            className="font-body text-xs max-w-xs"
            style={{ color: "var(--color-muted)" }}
          >
            Explore recipes, products and stories while you wait to hear back
            from us.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {TOOLS.map(({ image, icon: Icon, title, desc, to }) => (
            <Link
              key={title}
              to={to}
              className="group rounded-2xl overflow-hidden bg-white transition-all duration-200 hover:shadow-xl"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <div className="h-36 overflow-hidden">
                <img
                  loading="lazy"
                  decoding="async"
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: "rgba(255,127,17,0.1)" }}
                >
                  <Icon size={14} style={{ color: "var(--color-orange)" }} />
                </span>
                <h3
                  className="font-heading font-bold text-sm mb-1"
                  style={{ color: "var(--color-text)" }}
                >
                  {title}
                </h3>
                <p className="font-body text-xs" style={{ color: "var(--color-muted)" }}>
                  {desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════ JOIN THE FAMILY CTA ══════════════════════ */}
      <section
        className="page-x py-14 sm:py-16 text-center relative overflow-hidden"
        style={{ backgroundColor: "var(--color-red)" }}
      >
        <div className="relative max-w-lg mx-auto">
          <h2 className="font-heading font-bold text-white text-2xl sm:text-3xl uppercase tracking-wide mb-2">
            Join the Smart Global Family
          </h2>
          <p className="font-body text-sm text-white/70 mb-7">
            Explore our full range of premium foods and beverages, or chat
            with us directly on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/products" className="btn-white whitespace-nowrap">
              Shop Our Products
            </Link>
            <a
              href="https://wa.me/254700826813"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary whitespace-nowrap"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </main>
  );
}
