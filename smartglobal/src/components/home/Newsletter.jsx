import React, { useState } from "react";
import { Mail, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="page-x pb-2">
      <div className="rounded-2xl px-6 py-10 sm:px-12 flex flex-col sm:flex-row bg-[#010028] items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <h2 className="font-heading text-white text-xl sm:text-2xl font-bold leading-tight">
            Sign Up For Newsletter &amp; Get 10% Off
          </h2>
          <p className="text-white/70 text-xs mt-2 max-w-md">
            New products, recipes and exclusive offers — straight to your inbox.
          </p>
        </div>

        {subscribed ? (
          <div className="flex items-center gap-2 text-white font-body font-bold text-sm bg-white/15 px-5 py-3 rounded-full">
            <Check size={16} /> Thanks — you're subscribed!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full sm:w-auto gap-2">
            <div className="relative flex-1 sm:w-72">
              <Mail
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-full text-sm font-body focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <button type="submit" className="btn-white text-xs flex-shrink-0">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
