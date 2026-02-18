import React from "react";
import { User, Mail, Phone, MapPin, ArrowRight, Clock } from "lucide-react";
import { assets } from "../assets/assets";

export default function ContactUs() {
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const maxMessage = 500;
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > maxMessage) return;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting Smart Global! We'll get back to you soon.");
    setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
  };

  return (
    <main className="min-h-screen bg-white page-x section-y">
      <div
        className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-xl"
        style={{ border: "1px solid var(--color-border)" }}
      >
        {/* LEFT — image + contact info */}
        <div className="relative">
          {/* Image */}
          <div
            className="h-64 sm:h-80 lg:h-full relative overflow-hidden"
            style={{ minHeight: 400 }}
          >
            <img
              src={assets.topping}
              alt="Smart Global Premium Products"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, var(--color-orange-dark) 0%, rgba(217,104,0,0.5) 40%, transparent 100%)",
              }}
            />
            {/* Overlay text */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p
                className="text-eyebrow mb-2"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Smart Global
              </p>
              <h2
                className="font-heading font-bold text-white mb-1"
                style={{
                  fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Get in Touch
              </h2>
              <p
                className="font-body text-sm font-semibold"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                We're here to help you
              </p>
            </div>
          </div>

          {/* Contact cards */}
          <div
            className="p-6 sm:p-8 space-y-3"
            style={{ backgroundColor: "var(--color-bg-soft)" }}
          >
            {[
              {
                icon: Mail,
                title: "Email Support",
                sub: "Quick response guaranteed",
                text: "info@smartglobal.com",
                href: "mailto:info@smartglobal.com",
              },
              {
                icon: MapPin,
                title: "Visit Our Office",
                sub: "Nairobi, Kenya",
                text: "Nairobi Business District",
                href: "#",
              },
              {
                icon: Phone,
                title: "Call Us Directly",
                sub: "Mon–Sat, 8AM–6PM",
                text: "+254 700 000 000",
                href: "tel:+254700000000",
              },
            ].map(({ icon: Icon, title, sub, text, href }) => (
              <a
                key={title}
                href={href}
                className="flex items-center gap-4 p-3.5 rounded-xl transition-all duration-200 group"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid var(--color-border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-orange)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                  style={{ backgroundColor: "rgba(255,127,17,0.1)" }}
                >
                  <Icon size={15} style={{ color: "var(--color-orange)" }} />
                </span>
                <div>
                  <p
                    className="font-body text-xs font-bold"
                    style={{ color: "var(--color-text)" }}
                  >
                    {title}
                  </p>
                  <p
                    className="font-body text-[0.6rem]"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {sub}
                  </p>
                  <p
                    className="font-body text-xs font-semibold mt-0.5"
                    style={{ color: "var(--color-orange)" }}
                  >
                    {text}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="px-6 py-8 sm:px-10 sm:py-10 bg-white">
          <div className="max-w-lg mx-auto">
            {/* Header */}
            <div className="mb-7">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                style={{
                  backgroundColor: "rgba(255,127,17,0.1)",
                  border: "1px solid rgba(255,127,17,0.25)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--color-orange)" }}
                />
                <span
                  className="font-body text-[0.6rem] font-bold uppercase tracking-widest"
                  style={{ color: "var(--color-orange)" }}
                >
                  Contact Smart Global
                </span>
              </div>

              <h1
                className="font-heading font-bold mb-2"
                style={{
                  fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
                  color: "var(--color-text)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Let's Get in Touch
              </h1>

              <p
                className="font-body text-xs leading-relaxed"
                style={{ color: "var(--color-muted)" }}
              >
                Questions about our products or want to become a distributor?
                Reach out or email{" "}
                <a
                  href="mailto:info@smartglobal.com"
                  className="font-semibold"
                  style={{ color: "var(--color-orange)" }}
                >
                  info@smartglobal.com
                </a>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <Field
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  icon={User}
                  required
                />
                <Field
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  icon={User}
                  required
                />
              </div>

              {/* Email */}
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                icon={Mail}
                required
              />

              {/* Phone */}
              <div className="flex gap-2">
                <div
                  className="flex items-center gap-1.5 px-3 rounded-xl font-body text-xs font-bold flex-shrink-0"
                  style={{
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                    backgroundColor: "var(--color-bg-soft)",
                  }}
                >
                  🇰🇪 +254
                </div>
                <Field
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="700 000 000"
                  value={form.phone}
                  onChange={handleChange}
                  icon={Phone}
                  required
                />
              </div>

              {/* Message */}
              <div>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  required
                  className="w-full rounded-xl font-body text-xs text-gray-700 placeholder-gray-400 focus:outline-none transition-all duration-200 resize-none"
                  style={{
                    border: "1px solid var(--color-border)",
                    padding: "0.75rem 1rem",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-orange)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-border)";
                  }}
                />
                <p
                  className="font-body text-[0.58rem] text-right mt-1"
                  style={{ color: "var(--color-muted)" }}
                >
                  {form.message.length}/{maxMessage}
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-secondary w-full flex items-center justify-center gap-2 group"
                style={{ fontSize: "0.65rem" }}
              >
                Submit Message
                <ArrowRight
                  size={13}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </button>

              {/* Office hours */}
              <div
                className="flex items-center gap-2 pt-3 border-t font-body"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Clock size={12} style={{ color: "var(--color-orange)" }} />
                <span
                  className="text-[0.62rem]"
                  style={{ color: "var(--color-muted)" }}
                >
                  Office Hours: Monday – Saturday, 8:00 AM – 6:00 PM EAT
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <p
        className="text-center font-body text-[0.62rem] mt-5"
        style={{ color: "var(--color-muted)" }}
      >
        Expected response time:{" "}
        <span className="font-bold" style={{ color: "var(--color-orange)" }}>
          Within 24 hours
        </span>
      </p>
    </main>
  );
}

function Field({
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  required,
}) {
  return (
    <div className="relative flex-1">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Icon size={13} style={{ color: "var(--color-muted)" }} />
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl font-body text-xs text-gray-700 placeholder-gray-400 focus:outline-none transition-all duration-200"
        style={{
          border: "1px solid var(--color-border)",
          padding: "0.65rem 0.75rem 0.65rem 2.2rem",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--color-orange)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--color-border)";
        }}
      />
    </div>
  );
}
