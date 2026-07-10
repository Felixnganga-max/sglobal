import { assets } from "../assets/assets";

/**
 * Keeps the curated dummy content that ships with the site, and appends
 * whatever has been added for real through the dashboard so new records
 * show up on the live pages without touching the curated list.
 */
export function mergeWithLive(dummyArray, liveArray) {
  if (!Array.isArray(liveArray) || liveArray.length === 0) return dummyArray;
  return [...dummyArray, ...liveArray];
}

// Recipe documents from the API don't match the shape of the curated
// recipesData.js entries 1:1 (Mongo ids, numeric prep/cook times, a real
// image URL instead of an asset key) — normalize them so the existing
// recipe cards/detail page can render either kind interchangeably.
export function normalizeLiveRecipe(recipe) {
  return {
    ...recipe,
    id: recipe._id,
    image: recipe.image?.url,
    cookTime: `${recipe.cookTime} min`,
    prepTime: `${recipe.prepTime} min`,
    totalTime: `${recipe.totalTime} min`,
    author: recipe.author || {
      name: "Smart Global Team",
      avatar: "SG",
      bio: "",
    },
    isLive: true,
  };
}

// Blog documents from the API already store a real image URL (matching
// the dummy data's use of imported asset URLs), so only author/id need
// normalizing to match the shape Blogs.jsx expects.
export function normalizeLiveBlog(blog) {
  return {
    ...blog,
    id: blog._id,
    featuredImage: blog.featuredImage?.url,
    author: {
      name: blog.author?.name || "Smart Global Team",
      role: blog.author?.role || "FMCG Product Specialists",
      avatar: blog.author?.avatarUrl || assets.logo,
    },
    isLive: true,
  };
}
