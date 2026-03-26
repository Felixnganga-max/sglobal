import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { assets } from "../assets/assets";

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

      {/* FAQs Section */}
      <section className="px-4 sm:px-10 md:px-20 py-12 md:py-20 bg-[#f7f5f3]">
        <style>{`
    .faq-item { background:#fff; border:1px solid #ebebeb; border-radius:14px; overflow:hidden; transition:border-color 0.25s, box-shadow 0.25s; margin-bottom:10px; }
    .faq-item.open { border-color:#BF1A1A; box-shadow:0 0 0 3px rgba(191,26,26,0.07); }
    .faq-btn { width:100%; display:flex; align-items:center; justify-content:space-between; gap:16px; padding:18px 20px; background:none; border:none; cursor:pointer; text-align:left; font-family:inherit; }
    .faq-q { font-size:14px; font-weight:600; color:#1a1a1a; line-height:1.5; flex:1; transition:color 0.2s; }
    .faq-item.open .faq-q, .faq-btn:hover .faq-q { color:#BF1A1A; }
    .faq-icon { width:28px; height:28px; border-radius:50%; border:1.5px solid #e0e0e0; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background 0.25s, border-color 0.25s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1); }
    .faq-item.open .faq-icon { background:#BF1A1A; border-color:#BF1A1A; transform:rotate(45deg); }
    .faq-body { max-height:0; overflow:hidden; transition:max-height 0.4s cubic-bezier(0.4,0,0.2,1); }
    .faq-body-inner { padding:14px 20px 20px; font-size:13px; color:#666; line-height:1.75; border-top:1px solid #f2f2f2; }
    .faq-tag { display:inline-block; font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:2px 8px; border-radius:20px; margin-right:6px; margin-bottom:10px; }
    .tag-water { background:#e6f1fb; color:#185FA5; }
    .tag-spuds { background:#fef2f2; color:#A32D2D; }
    .tag-kent  { background:#faeeda; color:#633806; }
    .tag-gen   { background:#f1efe8; color:#5F5E5A; }
  `}</style>

        <div className="mb-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#BF1A1A] mb-2">
            Got questions?
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Frequently asked questions
          </h2>
          <div className="w-10 h-[3px] bg-[#BF1A1A] rounded-full mx-auto" />{" "}
          {/* mx-auto centers the bar */}
        </div>

        <div className="mx-auto max-w-3xl">
          {[
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
          ].map((faq, i) => (
            <FaqItem key={i} faq={faq} />
          ))}
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
            to="/products"
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
