import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/Cartcontext.jsx";
import { HelmetProvider, Helmet } from "react-helmet-async";

const SITE_URL = "https://www.smartglobal.co.ke";

/* ─────────────────────────────────────────────────────────
   STRUCTURED DATA SCHEMAS
───────────────────────────────────────────────────────── */

const organizationSchema = {
  "@context": SITE_URL,
  "@type": "Organization",
  name: "Smart Global Limited",
  alternateName: ["Smart Global", "SMART GLOBAL"],
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  foundingDate: "2007",
  description:
    "Smart Global Limited started operations in 2007 and has since become authorized importers and distributors for Kent Boringer and Spuds Craft Crisps, and a local distributor for Kizembe Spring Water. Products available countrywide in all leading supermarkets, retailers, and across the HORECA industry in Kenya.",
  email: "info@smartglobal.com",
  telephone: "+254700000000",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressRegion: "Nairobi County",
    addressCountry: "KE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+254700000000",
    email: "info@smartglobal.com",
    contactType: "customer service",
    areaServed: "KE",
    availableLanguage: ["English", "Swahili"],
  },
  sameAs: [
    // Add your social links here once confirmed:
    // "https://www.facebook.com/smartglobalke",
    // "https://www.instagram.com/smartglobalke",
    // "https://www.tiktok.com/@smartglobalke",
    // "https://twitter.com/smartglobalke",
  ],
};

const websiteSchema = {
  "@context": SITE_URL,
  "@type": "WebSite",
  name: "Smart Global Limited",
  alternateName: "Smart Global Kenya",
  url: SITE_URL,
  description:
    "Premium food products delivered across Kenya since 2007. Kent Boringer, Spuds Craft Crisps, and Kizembe Spring Water.",
  inLanguage: "en-KE",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const localBusinessSchema = {
  "@context": SITE_URL,
  "@type": "FoodEstablishment",
  name: "Smart Global Limited",
  image: `${SITE_URL}/logo.png`,
  url: SITE_URL,
  telephone: "+254700000000",
  email: "info@smartglobal.com",
  foundingDate: "2007",
  priceRange: "KSh",
  currenciesAccepted: "KES",
  description:
    "Authorized importers and distributors of Kent Boringer (soups, stock cubes, sauces, syrups, pancake mixes, muffin mixes, whipped cream) and Spuds Craft Crisps. Local distributor for Kizembe Natural Spring Water from Limuru. Available in all leading supermarkets across Kenya.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressRegion: "Nairobi County",
    addressCountry: "KE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -1.286389,
    longitude: 36.817223,
  },
  areaServed: {
    "@type": "Country",
    name: "Kenya",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Smart Global Product Catalog",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Kent Boringer",
          brand: { "@type": "Brand", name: "Kent Boringer" },
          description:
            "A household name since 2013. Soups, stock cubes & powder, sauces & syrups, pancake mixes, muffin mixes, whipped cream and cream caramel — trusted in kitchens across Kenya.",
          category: "Food & Beverages",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Spuds Craft Crisps",
          brand: { "@type": "Brand", name: "Spuds" },
          description:
            "9 unique flavor profiles of craft cooked crisps. Halal certified, made from high quality consistent potatoes with bold flavoring.",
          category: "Snacks",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Kizembe Natural Spring Water",
          brand: { "@type": "Brand", name: "Kizembe" },
          description:
            "Natural spring water from Limuru. Available in 300ml, 500ml, 1L, 5L, 10L and 18.9L — fresh, pure and for every occasion.",
          category: "Beverages",
        },
      },
    ],
  },
};

const siteNavigationSchema = {
  "@context": SITE_URL,
  "@type": "ItemList",
  name: "Smart Global Limited — Site Navigation",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Products",
      url: `${SITE_URL}/products`,
      description:
        "Shop Kent Boringer, Spuds Craft Crisps, Kizembe Water and more",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Recipes",
      url: `${SITE_URL}/recipes`,
      description:
        "Delicious Halal-certified recipes using Smart Global products",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Blogs",
      url: `${SITE_URL}/blogs`,
      description: "Food tips, nutrition guides and news from Smart Global",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "About Us",
      url: `${SITE_URL}/about`,
      description:
        "Smart Global Limited — premium food importers & distributors since 2007",
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Contact",
      url: `${SITE_URL}/contact`,
      description: "Contact Smart Global Limited, Nairobi, Kenya",
    },
  ],
};

/* ─────────────────────────────────────────────────────────
   RENDER
───────────────────────────────────────────────────────── */

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    {/* Global SEO — applies site-wide. Each page can add its own <Helmet> to override title/description */}
    <Helmet>
      {/* ── Primary Meta ── */}
      <html lang="en" />
      <title>Smart Global Limited | Premium Foods Kenya Since 2007</title>
      <meta
        name="description"
        content="Smart Global Limited — Kenya's trusted importer and distributor of premium foods since 2007. Shop Kent Boringer soups, sauces & pancake mixes, Spuds Craft Crisps and Kizembe Spring Water. Available nationwide."
      />
      <meta
        name="keywords"
        content="Smart Global Kenya, Kent Boringer Kenya, Spuds Crisps Kenya, Kizembe Spring Water, premium foods Kenya, halal food Kenya, food distributor Nairobi, buy food online Kenya, soups Kenya, pancake mix Kenya, spring water Limuru"
      />
      <meta name="author" content="Smart Global Limited" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={SITE_URL} />

      {/* ── Open Graph (Facebook, WhatsApp, LinkedIn previews) ── */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Smart Global Limited" />
      <meta
        property="og:title"
        content="Smart Global Limited | Premium Foods Kenya Since 2007"
      />
      <meta
        property="og:description"
        content="Authorized importers and distributors of Kent Boringer and Spuds Craft Crisps. Local distributor for Kizembe Spring Water. Available in all leading supermarkets across Kenya."
      />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:image" content={`${SITE_URL}/logo.png`} />
      <meta property="og:image:alt" content="Smart Global Limited Logo" />
      <meta property="og:locale" content="en_KE" />

      {/* ── Twitter / X Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@smartglobalke" />
      <meta
        name="twitter:title"
        content="Smart Global Limited | Premium Foods Kenya"
      />
      <meta
        name="twitter:description"
        content="Kent Boringer, Spuds Craft Crisps & Kizembe Spring Water. Quality you can trust. Flavours you'll love."
      />
      <meta name="twitter:image" content={`${SITE_URL}/logo.png`} />

      {/* ── Geo targeting (boosts Kenyan local search results) ── */}
      <meta name="geo.region" content="KE-110" />
      <meta name="geo.placename" content="Nairobi, Kenya" />
      <meta name="geo.position" content="-1.286389;36.817223" />
      <meta name="ICBM" content="-1.286389, 36.817223" />

      {/* ── Structured Data ── */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(siteNavigationSchema)}
      </script>
    </Helmet>

    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </HelmetProvider>,
);
