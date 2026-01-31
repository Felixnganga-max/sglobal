import React, { useState } from "react";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Products", href: "#" },
    { name: "Brands", href: "#" },
    { name: "About Us", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <header className="bg-[#fcf6e9]">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-3">
            <div className="rounded-full bg-green-800 text-white font-bold w-10 h-10 flex items-center justify-center">
              F
            </div>
            <span className="font-serif text-2xl text-green-800">Flaum</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-800 hover:text-green-800 transition"
              >
                {link.name}
                {link.name === "Products" && (
                  <ChevronDown className="inline-block ml-1 h-4 w-4" />
                )}
              </a>
            ))}
          </nav>

          {/* Right icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              aria-label="Search"
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Search className="h-5 w-5 text-gray-700" />
            </button>

            <button
              aria-label="Cart"
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ShoppingCart className="h-5 w-5 text-gray-700" />
            </button>

            <button
              aria-label="Account"
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <User className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen((s) => !s)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {mobileOpen ? (
                <X className="h-6 w-6 text-gray-800" />
              ) : (
                <Menu className="h-6 w-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {mobileOpen && (
          <nav className="mt-3 md:hidden bg-white rounded-lg shadow-sm p-4">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="block py-2 px-3 rounded hover:bg-gray-50 text-gray-800"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li className="flex items-center space-x-3 pt-2">
                <button aria-label="Search" className="p-2 rounded-md">
                  <Search className="h-5 w-5 text-gray-700" />
                </button>
                <button aria-label="Cart" className="p-2 rounded-md">
                  <ShoppingCart className="h-5 w-5 text-gray-700" />
                </button>
                <button aria-label="Account" className="p-2 rounded-md">
                  <User className="h-5 w-5 text-gray-700" />
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
