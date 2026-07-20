import { next } from "@vercel/functions";

// This is a Vite SPA — all meta tags (title, Open Graph, product info) are
// injected client-side via react-helmet-async in src/main.jsx. That works
// fine for real visitors, but link-preview crawlers (Facebook, WhatsApp,
// Twitter/X, LinkedIn, Telegram, Slack...) fetch the raw HTML and never run
// our JavaScript, so they only ever saw the bare <title> from index.html —
// no image, no price, no description, on any page.
//
// This middleware runs at the edge, before Vercel's SPA rewrite. For normal
// browsers it's a no-op (next()). For known link-preview bots it serves a
// small prerendered HTML document with the real Open Graph / Twitter Card
// tags — product-specific (title, price, image) for /product/:id pages,
// and the site-wide defaults (mirrored from main.jsx) everywhere else.
export const config = {
  matcher: [
    "/((?!assets/|api/|.*\\.(?:js|mjs|css|map|png|jpg|jpeg|gif|webp|avif|svg|ico|txt|json|woff2?|ttf|xml)$).*)",
  ],
};

const API_BASE_URL = "https://sglobal-plf6.vercel.app/smartglobal";
const SITE_NAME = "Smart Global Limited";
const DEFAULT_TITLE = "Smart Global Limited | Premium Foods Kenya Since 2007";
const DEFAULT_DESCRIPTION =
  "Kenya's trusted importer and distributor of premium foods since 2007. Shop Kent Boringer soups, sauces & pancake mixes, Spuds Craft Crisps and Kizembe Spring Water. Available nationwide.";

// Link-preview / chat-app crawlers only — deliberately excludes Googlebot
// etc. General SEO crawling is a separate concern from social-share
// previews and isn't touched here.
const BOT_UA_RE =
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Slackbot|Discordbot|Pinterest(?:bot)?|redditbot|SkypeUriPreview|vkShare|Viber|Line\/|Snapchat/i;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Mirrors the image-field priority order used by resolveImages() in
// src/pages/ProductDetails.jsx, so the preview matches what the page shows.
function resolveProductImage(product, origin) {
  const candidates = [
    product?.images?.[0]?.url,
    product?.image?.url,
    product?.imageUrl,
    product?.img,
    product?.photo,
  ];
  return candidates.find((u) => typeof u === "string" && u) || `${origin}/logo.jpg`;
}

function renderHtml({ title, description, image, url, extraMeta = "" }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImage = escapeHtml(image);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${safeTitle}</title>
<meta name="description" content="${safeDescription}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${SITE_NAME}" />
<meta property="og:title" content="${safeTitle}" />
<meta property="og:description" content="${safeDescription}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${safeImage}" />
<meta property="og:image:width" content="800" />
<meta property="og:image:height" content="800" />
<meta property="og:locale" content="en_KE" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${safeTitle}" />
<meta name="twitter:description" content="${safeDescription}" />
<meta name="twitter:image" content="${safeImage}" />
${extraMeta}
</head>
<body>
<a href="${url}">${safeTitle}</a>
</body>
</html>`;
}

async function buildProductPreview(id, url) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) return null;

  const data = await res.json();
  const product = data?.success ? data.data : data;
  if (!product?.title) return null;

  const moq = product.minimumOrderQuantity || 1;
  const unitPrice = product.price || 0;
  const packPrice =
    product.totalPrice != null ? product.totalPrice : unitPrice * moq;

  const priceLine =
    moq > 1
      ? `KSh ${packPrice.toLocaleString()} — pack of ${moq} (KSh ${unitPrice.toLocaleString()} per piece)`
      : `KSh ${unitPrice.toLocaleString()}`;

  const description = product.shortDescription
    ? `${product.shortDescription} — ${priceLine}`
    : `${priceLine} · ${product.category || SITE_NAME}`;

  return renderHtml({
    title: `${product.title} | ${SITE_NAME}`,
    description,
    image: resolveProductImage(product, url.origin),
    url: `${url.origin}${url.pathname}`,
    extraMeta: `<meta property="product:price:amount" content="${packPrice}" />\n<meta property="product:price:currency" content="KES" />`,
  });
}

export default async function middleware(request) {
  const ua = request.headers.get("user-agent") || "";
  if (!BOT_UA_RE.test(ua)) {
    return next();
  }

  const url = new URL(request.url);
  const productMatch = url.pathname.match(/^\/product\/([^/]+)\/?$/);

  if (productMatch) {
    try {
      const html = await buildProductPreview(productMatch[1], url);
      if (html) {
        return new Response(html, {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }
    } catch {
      // Backend unreachable or product missing — fall through to the
      // generic site preview below rather than failing the request.
    }
  }

  return new Response(
    renderHtml({
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      image: `${url.origin}/logo.jpg`,
      url: `${url.origin}${url.pathname}`,
    }),
    { status: 200, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}
