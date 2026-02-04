import React from "react";
import { User, Mail, Phone, MapPin, ArrowRight, Clock } from "lucide-react";
import { assets } from "../assets/assets";

/**
 * Smart Global ContactUs Component
 * Colors: Red (#BF1A1A), Yellow (#FFD41D), Black, White, Brown (#7B4019)
 * Enhanced with brand styling and assets images
 */

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
    console.log("Form submitted:", form);
    alert("Thank you for contacting Smart Global! We'll get back to you soon.");
    // Reset form
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="rounded-3xl bg-white shadow-2xl overflow-hidden border-2 border-[#FFD41D]">
          <div className="lg:grid lg:grid-cols-2">
            {/* LEFT: Image + Contact Cards */}
            <div className="relative bg-[#FFF8E1]">
              {/* Large left image */}
              <div className="h-96 lg:h-[600px] relative overflow-hidden">
                <img
                  src={assets.topping}
                  alt="Smart Global Premium Products"
                  className="w-full h-full object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#BF1A1A]/80 via-[#BF1A1A]/40 to-transparent"></div>

                {/* Brand overlay text */}
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h2
                    className="text-4xl md:text-5xl font-black mb-2"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    GET IN TOUCH
                  </h2>
                  <p className="text-lg text-[#FFD41D] font-bold">
                    We're Here to Help You
                  </p>
                </div>
              </div>

              {/* Decorative curved white panel bottom */}
              <svg
                viewBox="0 0 600 120"
                className="absolute -bottom-1 left-0 w-full text-white"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0,120 C200,0 400,0 600,120 L600,120 L0,120 Z"
                  fill="white"
                />
              </svg>

              {/* Contact cards below the image */}
              <div className="bg-white -mt-2 px-6 pb-10">
                <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                  <ContactCard
                    icon={<Mail size={20} />}
                    title="Email Support"
                    subtitle="Quick response guaranteed"
                    linkText="info@smartglobal.com"
                    href="mailto:info@smartglobal.com"
                  />

                  <ContactCard
                    icon={<MapPin size={20} />}
                    title="Visit Our Office"
                    subtitle="Nairobi, Kenya"
                    linkText="Nairobi Business District"
                    href="#"
                  />

                  <ContactCard
                    icon={<Phone size={20} />}
                    title="Call Us Directly"
                    subtitle="Available Mon-Sat 8AM-6PM"
                    linkText="+254 700 000 000"
                    href="tel:+254700000000"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT: Form Panel */}
            <div className="px-6 py-10 lg:px-12 lg:py-16 bg-white">
              <div className="max-w-xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF8E1] border-2 border-[#FFD41D] mb-4">
                    <div className="w-2 h-2 bg-[#BF1A1A] rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-[#7B4019]">
                      Contact Smart Global
                    </span>
                  </div>

                  <h1
                    className="text-4xl sm:text-5xl font-black text-gray-900 mb-3"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    Let's Get In Touch
                  </h1>

                  <p className="text-base text-gray-600 leading-relaxed">
                    Have questions about our products? Want to become a
                    distributor? Or just reach out manually to{" "}
                    <a
                      href="mailto:info@smartglobal.com"
                      className="text-[#BF1A1A] font-bold hover:underline"
                    >
                      info@smartglobal.com
                    </a>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputWithIcon
                      id="firstName"
                      name="firstName"
                      placeholder="First name"
                      value={form.firstName}
                      onChange={handleChange}
                      icon={<User size={18} />}
                      ariaLabel="First name"
                      required
                    />
                    <InputWithIcon
                      id="lastName"
                      name="lastName"
                      placeholder="Last name"
                      value={form.lastName}
                      onChange={handleChange}
                      icon={<User size={18} />}
                      ariaLabel="Last name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <InputWithIcon
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={handleChange}
                    icon={<Mail size={18} />}
                    ariaLabel="Email address"
                    required
                  />

                  {/* Phone */}
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 bg-gray-50">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-700">
                          🇰🇪
                        </span>
                        <span className="text-sm font-bold text-gray-700">
                          +254
                        </span>
                      </span>
                    </div>

                    <div className="flex-1">
                      <InputWithIcon
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="700 000 000"
                        value={form.phone}
                        onChange={handleChange}
                        icon={<Phone size={18} />}
                        ariaLabel="Phone number"
                        required
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="sr-only">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      required
                      className="w-full rounded-xl border-2 border-gray-200 px-5 py-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-[#BF1A1A] transition-all duration-300 font-medium"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      aria-label="Message"
                    />
                    <div className="mt-2 text-xs text-gray-500 text-right font-semibold">
                      {form.message.length}/{maxMessage} characters
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="group w-full inline-flex items-center justify-center gap-3 bg-[#BF1A1A] hover:bg-[#8B1414] text-white py-4 rounded-full text-base font-black shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      aria-label="Submit Contact Form"
                    >
                      <span className="text-lg">Submit Message</span>
                      <ArrowRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>

                  {/* Office Hours Info */}
                  <div className="pt-4 border-t-2 border-[#FFD41D]">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} className="text-[#BF1A1A]" />
                      <span className="font-semibold">
                        Office Hours: Monday - Saturday, 8:00 AM - 6:00 PM EAT
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info Strip */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Expected response time:{" "}
            <span className="text-[#BF1A1A] font-bold">Within 24 hours</span>
          </p>
        </div>
      </div>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;600;700;800;900&display=swap");
      `}</style>
    </main>
  );
}

/* InputWithIcon - Brand-styled input with left icon */
function InputWithIcon({
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  ariaLabel,
  required = false,
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {ariaLabel}
      </label>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
        {React.cloneElement(icon, { className: "text-gray-400" })}
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border-2 border-gray-200 px-5 py-3 pl-12 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-[#BF1A1A] transition-all duration-300 font-semibold"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
        aria-label={ariaLabel}
      />
    </div>
  );
}

/* Contact Card - Brand-styled contact information card */
function ContactCard({ icon, title, subtitle, linkText, href }) {
  return (
    <div className="group flex gap-4 items-start p-4 rounded-xl hover:bg-[#FFF8E1] transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-[#FFF8E1] border-2 border-[#FFD41D] flex items-center justify-center text-[#BF1A1A] group-hover:bg-[#BF1A1A] group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div>
        <div
          className="text-sm font-black text-gray-900 mb-1"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {title}
        </div>
        <div className="text-xs text-gray-600 mb-2 font-semibold">
          {subtitle}
        </div>
        <div className="text-sm">
          <a
            href={href}
            className="text-[#BF1A1A] hover:text-[#8B1414] font-bold hover:underline transition-colors"
          >
            {linkText}
          </a>
        </div>
      </div>
    </div>
  );
}
