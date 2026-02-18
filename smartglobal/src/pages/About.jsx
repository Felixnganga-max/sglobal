import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <div
        className="relative w-full h-56 sm:h-72 md:h-96 bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `url(${assets.kent})`,
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 pl-6 sm:pl-12 md:pl-20">
          <p className="text-[#FFD41D] text-xs font-black uppercase tracking-[0.3em] mb-2">
            Since 2007
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-wider uppercase">
            About Us
          </h1>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-white px-4 sm:px-10 md:px-20 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-[#BF1A1A] hover:underline font-medium">
            Smart Global
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-600">About Us</span>
        </div>
      </div>

      {/* WHO WE ARE Section */}
      <section className="px-4 sm:px-10 md:px-20 py-10 md:py-16 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Content */}
          <div>
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                WHO WE ARE
              </h2>
              <div className="w-16 h-1 bg-[#BF1A1A]"></div>
            </div>

            <div className="space-y-4 text-gray-700 text-sm leading-7">
              <p>
                <span className="text-[#BF1A1A] font-semibold">
                  Smart Global Limited
                </span>{" "}
                started operations in 2007 with an assortment of commodities and
                has since become authorized importers and distributors for{" "}
                <span className="font-semibold">Kent Boringer</span> and{" "}
                <span className="font-semibold">Spuds</span>, and a local
                distributor for{" "}
                <span className="font-semibold">Kizembe spring water</span>.
              </p>

              <p>
                Our products are available countrywide in all leading
                supermarkets, various other retailers, and across the HORECA
                industry — bringing quality food and beverages to every table in
                Kenya.
              </p>

              <p className="text-[#BF1A1A] font-medium">
                Quality you can trust. Flavours you'll love.
              </p>
            </div>
          </div>

          {/* Image — hidden on very small screens, shown md+ */}
          <div className="hidden md:block">
            <img
              src={assets.topping}
              alt="Smart Global Products"
              className="w-full h-96 rounded-sm shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Image shown below text on mobile */}
        <div className="block md:hidden mt-6">
          <img
            src={assets.topping}
            alt="Smart Global Products"
            className="w-full h-52 rounded-sm shadow-lg object-cover"
          />
        </div>
      </section>

      {/* Three Column — Products Section */}
      <section className="px-4 sm:px-10 md:px-20 py-10 md:py-16 bg-white">
        <div className="mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
            OUR PRODUCTS
          </h2>
          <div className="w-16 h-1 bg-[#BF1A1A]"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {/* Kent Boringer */}
          <div>
            <div className="overflow-hidden rounded-sm mb-4 h-48 sm:h-52 md:h-56">
              <img
                src={assets.kent}
                alt="Kent Boringer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
              KENT BORINGER
            </h3>
            <p className="text-gray-700 text-sm leading-6">
              A household name since 2013. Kent Boringer offers soups, stock
              cubes &amp; powder, sauces &amp; syrups, pancake mixes, muffin
              mixes, whipped cream and cream caramel — trusted in kitchens
              across Kenya.
            </p>
          </div>

          {/* Spuds */}
          <div>
            <div className="overflow-hidden rounded-sm mb-4 h-48 sm:h-52 md:h-56">
              <img
                src={assets.spuds}
                alt="Spuds Craft Crisps"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
              SPUDS CRAFT CRISPS
            </h3>
            <p className="text-gray-700 text-sm leading-6">
              Headlining{" "}
              <span className="font-bold">9 unique flavor profiles</span>, Spuds
              craft cooked crisps are an instant success — built on high
              quality, consistent potatoes and bold flavoring. Halal certified.
            </p>
          </div>

          {/* Kizembe */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="overflow-hidden rounded-sm mb-4 h-48 sm:h-52 md:h-56 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <div className="text-center px-6">
                <div className="text-5xl mb-3">💧</div>
                <p className="text-[#1A7BBF] font-black text-lg uppercase tracking-wide">
                  Kizembe
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Natural Spring Water
                </p>
              </div>
            </div>
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
              KIZEMBE SPRING WATER
            </h3>
            <p className="text-gray-700 text-sm leading-6">
              Natural springwater from Limuru, packaged uniquely in sizes of 300
              ml, 500 ml, 1 L, 5 L, 10 L and 18.9 L — fresh, pure, and for every
              occasion.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative w-full h-56 sm:h-64 md:h-72 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${assets.recipe})`,
        }}
      >
        <div className="absolute inset-0 bg-black/55"></div>

        <div className="relative z-10 text-center px-4">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-light text-white tracking-wider mb-3">
            Discover Flavours Worth Loving
          </h2>
          <Link
            to="/sales"
            className="inline-block mt-3 px-6 sm:px-8 py-3 bg-[#BF1A1A] text-white text-xs sm:text-sm font-black uppercase tracking-widest rounded-full hover:bg-[#8B1414] transition-colors shadow-lg"
          >
            See Our Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
