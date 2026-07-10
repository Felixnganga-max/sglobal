import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/config";

const API_URL = `${API_BASE_URL}/products`;

// Shared live-products fetch used across the homepage sections
// (trending, best deals, trending-this-week, recommended-for-you).
export function useProducts(limit = 200) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}?limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      const list = data.success
        ? data.data || []
        : Array.isArray(data)
          ? data
          : [];
      setProducts(list);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}

export const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

export function getProductImage(product) {
  return (
    product.images?.[0]?.url ||
    product.image?.url ||
    product.imageUrl ||
    product.img ||
    product.photo ||
    FALLBACK_IMG
  );
}
