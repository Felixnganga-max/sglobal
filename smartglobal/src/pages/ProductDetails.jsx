import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Star,
  Minus,
  Plus,
  ArrowLeft,
  Package,
  Truck,
  Shield,
  Share2,
  Check,
} from "lucide-react";
import { useCart } from "../context/Cartcontext";

const API_URL = "https://sglobal-plf6.vercel.app/smartglobal/products";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, updateQty, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    if (product?.category) fetchRelatedProducts();
  }, [product]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error("Product not found");
      const data = await response.json();
      setProduct(data.success ? data.data : data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        const all = data.success
          ? data.data || []
          : Array.isArray(data)
            ? data
            : [];
        const filtered = all
          .filter(
            (p) =>
              p.category === product.category &&
              (p._id || p.id) !== (product._id || product.id),
          )
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);
        setRelatedProducts(filtered);
      }
    } catch (err) {
      console.error("Error fetching related products:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.shortDescription,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-soft py-8 page-x">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
              <div className="h-12 bg-gray-200 rounded w-1/3 animate-pulse" />
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-soft flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border-2 border-red rounded-2xl p-8">
            <p className="font-heading font-bold text-xl mb-2 text-red">
              Product Not Found
            </p>
            <p className="text-body mb-6">
              {error || "This product doesn't exist"}
            </p>
            <button onClick={() => navigate(-1)} className="btn-primary">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Derived cart state ──
  const prodId = product._id || product.id;
  const cartItem = cartItems.find((item) => (item._id || item.id) === prodId);
  const cartQty = cartItem?.cartQty || 0;
  const inStock = product.stock > 0; // ← fixed: use stock not inStock
  const maxQty = product.stock || 99;

  // ── Cart actions ──
  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(product, 1);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  const handleIncrement = () => {
    if (cartQty === 0) {
      addToCart(product, 1);
    } else if (cartQty < maxQty) {
      updateQty(prodId, cartQty + 1);
    }
  };

  const handleDecrement = () => {
    if (cartQty <= 1) {
      removeFromCart(prodId);
    } else {
      updateQty(prodId, cartQty - 1);
    }
  };

  const getProductImages = () => {
    if (product.images && Array.isArray(product.images)) {
      return product.images
        .map((img) => (typeof img === "string" ? img : img?.url))
        .filter(Boolean);
    }
    const url =
      product.image?.url || product.imageUrl || product.img || product.photo;
    return url ? [url] : [];
  };

  const images = getProductImages();
  const currentImage =
    images[selectedImage] ||
    images[0] ||
    "https://via.placeholder.com/600?text=No+Image";
  const discount =
    product.discount ||
    (product.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100,
        )
      : null);

  // ── Button state ──
  const cartBtnColor = addedFeedback
    ? "#16a34a"
    : cartQty > 0
      ? "#8B1414"
      : "var(--color-red)";
  const cartBtnLabel = addedFeedback ? (
    <>
      <Check className="w-4 h-4" /> Added!
    </>
  ) : cartQty > 0 ? (
    <>
      <ShoppingCart className="w-4 h-4" /> In Cart ({cartQty})
    </>
  ) : (
    <>
      <ShoppingCart className="w-4 h-4" /> Add to Cart
    </>
  );

  return (
    <div className="min-h-screen bg-soft">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-body">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted hover:text-red transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-muted">{product.category || "Products"}</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-semibold truncate">
              {product.title}
            </span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border-2 border-border group">
              <img
                src={currentImage}
                alt={product.title}
                className="w-full h-full object-contain p-6"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600?text=No+Image";
                }}
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount && (
                  <span className="px-3 py-1 text-white text-sm font-body font-bold rounded bg-red">
                    {discount}% OFF
                  </span>
                )}
                {product.badge && (
                  <span
                    className="px-3 py-1 text-sm font-body font-bold rounded text-white"
                    style={{
                      backgroundColor:
                        product.badge === "NEW"
                          ? "var(--color-blue)"
                          : product.badge === "HOT"
                            ? "var(--color-orange)"
                            : "var(--color-red)",
                    }}
                  >
                    {product.badge}
                  </span>
                )}
                {!inStock && (
                  <span className="px-3 py-1 bg-gray-900 text-white text-sm font-body font-bold rounded">
                    OUT OF STOCK
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110"
              >
                <Heart
                  className="w-5 h-5"
                  style={{
                    fill: isWishlisted ? "var(--color-red)" : "transparent",
                    color: isWishlisted ? "var(--color-red)" : "#9ca3af",
                  }}
                />
              </button>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className="aspect-square rounded-lg overflow-hidden border-2 transition-all"
                    style={{
                      borderColor:
                        selectedImage === index
                          ? "var(--color-red)"
                          : "var(--color-border)",
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/150?text=No+Image";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            {product.category && (
              <span className="text-eyebrow inline-block">
                {product.category}
              </span>
            )}

            <h1 className="text-section-title text-gray-900">
              {product.title}
            </h1>

            {product.rating > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      style={{
                        fill:
                          i < Math.floor(product.rating)
                            ? "var(--color-orange)"
                            : "#e5e7eb",
                        color:
                          i < Math.floor(product.rating)
                            ? "var(--color-orange)"
                            : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>
                <span className="font-body text-sm text-muted">
                  {product.rating?.toFixed(1)} ({product.reviews || 0} reviews)
                </span>
              </div>
            )}

            {product.isHalal && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-body font-bold rounded-full border border-green-200">
                ✓ Halal Certified
              </span>
            )}

            {/* Price — reflects cart quantity */}
            <div className="flex items-baseline gap-3">
              <span className="font-heading font-bold text-3xl text-red">
                Ksh {(product.price * (cartQty || 1)).toLocaleString()}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="font-body text-lg text-gray-400 line-through">
                  Ksh {(product.oldPrice * (cartQty || 1)).toLocaleString()}
                </span>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-body">{product.shortDescription}</p>
            )}

            {/* Stock indicator */}
            <div className="flex items-center gap-2 py-3 px-4 bg-white rounded-xl border border-border">
              <Package
                className="w-4 h-4"
                style={{ color: inStock ? "#16a34a" : "var(--color-red)" }}
              />
              <span
                className="font-body text-sm font-semibold"
                style={{ color: inStock ? "#16a34a" : "var(--color-red)" }}
              >
                {inStock
                  ? `In Stock (${product.stock} available)`
                  : "Out of Stock"}
              </span>
            </div>

            {/* ── Quantity selector — wired to cart ── */}
            {inStock && (
              <div>
                <label className="text-label block mb-2 text-gray-700">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  {cartQty === 0 ? (
                    /* Not in cart yet — show Add to Cart button */
                    <button
                      onClick={handleAddToCart}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-body font-bold text-sm text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
                      style={{ backgroundColor: "var(--color-red)" }}
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                  ) : (
                    /* In cart — show stepper */
                    <div
                      className="flex items-center border-2 rounded-xl overflow-hidden transition-all"
                      style={{ borderColor: "var(--color-red)" }}
                    >
                      <button
                        onClick={handleDecrement}
                        className="px-4 py-2.5 hover:bg-red-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus
                          className="w-4 h-4"
                          style={{ color: "var(--color-red)" }}
                        />
                      </button>
                      <span
                        className="px-5 py-2.5 font-heading font-bold text-lg min-w-[52px] text-center"
                        style={{ color: "var(--color-red)" }}
                      >
                        {cartQty}
                      </span>
                      <button
                        onClick={handleIncrement}
                        disabled={cartQty >= maxQty}
                        className="px-4 py-2.5 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                      >
                        <Plus
                          className="w-4 h-4"
                          style={{ color: "var(--color-red)" }}
                        />
                      </button>
                    </div>
                  )}

                  {/* Cart count badge when in cart */}
                  {cartQty > 0 && (
                    <span className="font-body text-xs text-muted">
                      Ksh {(product.price * cartQty).toLocaleString()} total
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Actions row */}
            <div className="flex gap-3">
              <button
                onClick={
                  cartQty > 0 ? () => navigate("/place-order") : handleAddToCart
                }
                disabled={!inStock}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-body font-bold text-sm text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
                style={{ backgroundColor: cartBtnColor }}
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4" /> Added!
                  </>
                ) : cartQty > 0 ? (
                  <>
                    <ShoppingCart className="w-4 h-4" /> View Cart ({cartQty})
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-3 border-2 border-border rounded-xl hover:border-gray-400 transition-all"
              >
                <Share2 className="w-4 h-4 text-muted" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
              {[
                {
                  icon: Truck,
                  label: "Free Delivery",
                  sub: "Orders over Ksh 5,000",
                },
                {
                  icon: Shield,
                  label: "Quality Assured",
                  sub: "Premium products",
                },
                {
                  icon: Package,
                  label: "Easy Returns",
                  sub: "7-day return policy",
                },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-1.5"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "rgba(255,127,17,0.1)" }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: "var(--color-orange)" }}
                    />
                  </div>
                  <p className="font-body text-[0.65rem] font-bold text-gray-800">
                    {label}
                  </p>
                  <p className="font-body text-[0.58rem] text-muted">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description Blocks */}
        {product.descriptionBlocks && product.descriptionBlocks.length > 0 && (
          <div className="mt-12 max-w-3xl">
            <p className="text-eyebrow mb-2">Details</p>
            <h2 className="text-section-title text-gray-900 mb-4">
              Product Description
            </h2>
            <div className="section-rule mb-6" />
            <div className="space-y-4">
              {product.descriptionBlocks.map((block, i) => {
                if (block.type === "heading")
                  return (
                    <h3
                      key={i}
                      className="font-heading text-lg font-bold text-gray-900"
                    >
                      {block.content}
                    </h3>
                  );
                if (block.type === "paragraph")
                  return (
                    <p key={i} className="text-body">
                      {block.content}
                    </p>
                  );
                if (block.type === "bullet-list")
                  return (
                    <ul key={i} className="space-y-1">
                      {block.content.map((item, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 font-body text-sm text-muted"
                        >
                          <span className="text-red mt-0.5">●</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                if (block.type === "ordered-list")
                  return (
                    <ol key={i} className="space-y-1">
                      {block.content.map((item, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 font-body text-sm text-muted"
                        >
                          <span className="font-bold text-red">{j + 1}.</span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  );
                return null;
              })}
            </div>
          </div>
        )}

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="mt-10 max-w-3xl">
            <h3 className="font-heading text-lg font-bold text-gray-900 mb-3">
              Key Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 font-body text-sm text-muted"
                >
                  <span className="font-bold text-red">✓</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="mt-10 max-w-xl">
            <h3 className="font-heading text-lg font-bold text-gray-900 mb-3">
              Specifications
            </h3>
            <div className="border border-border rounded-xl overflow-hidden">
              {product.specifications.map((spec, i) => (
                <div
                  key={i}
                  className="flex"
                  style={{
                    borderBottom:
                      i < product.specifications.length - 1
                        ? "1px solid var(--color-border)"
                        : "none",
                  }}
                >
                  <div className="w-1/3 px-4 py-3 bg-soft text-label text-gray-700">
                    {spec.key}
                  </div>
                  <div className="flex-1 px-4 py-3 font-body text-sm text-muted">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-eyebrow mb-1">You May Also Like</p>
                <h2 className="text-section-title text-gray-900">
                  Related Products
                </h2>
                <div className="section-rule mt-2" />
              </div>
              <button
                onClick={() =>
                  navigate(`/products?category=${product.category}`)
                }
                className="font-body text-sm font-bold text-red hover:underline transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <RelatedProductCard
                  key={rel._id || rel.id}
                  product={rel}
                  onClick={() => navigate(`/product/${rel._id || rel.id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Replace the RelatedProductCard function at the bottom of ProductDetails.jsx with this:

function RelatedProductCard({ product, onClick }) {
  // Match the same resolver used for the main product
  const getImage = (p) => {
    if (p.images && Array.isArray(p.images) && p.images.length > 0) {
      const first = p.images[0];
      return typeof first === "string" ? first : first?.url;
    }
    return (
      p.image?.url ||
      p.imageUrl ||
      p.img ||
      p.photo ||
      product.images?.[0]?.url ||
      null
    );
  };

  const imageUrl =
    getImage(product) || "https://via.placeholder.com/300?text=No+Image";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-border overflow-hidden cursor-pointer group hover:shadow-md transition-all duration-300"
    >
      <div className="aspect-square bg-soft overflow-hidden">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300?text=No+Image";
          }}
        />
      </div>
      <div className="p-3">
        <h3 className="font-body text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
          {product.title}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="font-heading font-bold text-base text-red">
            Ksh {product.price?.toLocaleString()}
          </span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="font-body text-xs text-gray-400 line-through">
              Ksh {product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
