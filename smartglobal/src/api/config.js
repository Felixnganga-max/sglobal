// Single source of truth for the backend API base URL.
// Override per-environment on Vercel by setting VITE_API_URL.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://sglobal-plf6.vercel.app/smartglobal";
