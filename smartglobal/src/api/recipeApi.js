/**
 * Recipe API Service - Backend Integration Only
 * No mock data - 100% API-driven
 */

const API_BASE_URL = "https://smartglobal-3jfl.vercel.app/smartglobal/recipes";
const PRODUCTS_API_URL =
  "https://smartglobal-3jfl.vercel.app/smartglobal/products";

const getAuthToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("❌ No token found in localStorage!");
  } else {
    console.log("✅ Token found:", token.substring(0, 20) + "...");
  }
  return token;
};

const createHeaders = (isFormData = false) => {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    console.log("✅ Authorization header added");
  } else {
    console.error("❌ No token to add to headers!");
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    console.error("❌ API Error:", {
      status: response.status,
      message: data.message,
      url: response.url,
    });
    throw new Error(data.message || "An error occurred");
  }
  console.log("✅ API Success:", response.url);
  return data;
};

export const recipeApi = {
  getAllRecipes: async (params = {}) => {
    try {
      console.log("📡 Fetching all recipes with params:", params);
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}${queryString ? `?${queryString}` : ""}`;
      console.log("🌐 Request URL:", url);

      const headers = createHeaders();
      console.log("📋 Request headers:", headers);

      const response = await fetch(url, { method: "GET", headers });
      console.log("📥 Response status:", response.status);

      return handleResponse(response);
    } catch (error) {
      console.error("❌ Error in getAllRecipes:", error);
      throw error;
    }
  },

  getRecipe: async (identifier) => {
    const response = await fetch(`${API_BASE_URL}/${identifier}`, {
      method: "GET",
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  createRecipe: async (recipeData, imageFile = null) => {
    let body,
      headers = createHeaders(!!imageFile);

    if (imageFile && imageFile instanceof File) {
      const formData = new FormData();
      Object.entries(recipeData).forEach(([key, value]) => {
        if (
          key === "ingredients" ||
          key === "directions" ||
          key === "tips" ||
          key === "tags" ||
          key === "nutrition"
        ) {
          formData.append(key, JSON.stringify(value));
        } else if (key !== "imageName" && value !== undefined) {
          formData.append(key, value);
        }
      });
      formData.append("image", imageFile);
      body = formData;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(recipeData);
    }

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers,
      body,
    });
    return handleResponse(response);
  },

  updateRecipe: async (id, recipeData, imageFile = null) => {
    let body,
      headers = createHeaders(!!imageFile);

    if (imageFile && imageFile instanceof File) {
      const formData = new FormData();
      Object.entries(recipeData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (
            key === "ingredients" ||
            key === "directions" ||
            key === "tips" ||
            key === "tags" ||
            key === "nutrition"
          ) {
            formData.append(key, JSON.stringify(value));
          } else if (key !== "imageName") {
            formData.append(key, value);
          }
        }
      });
      formData.append("image", imageFile);
      body = formData;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(recipeData);
    }

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers,
      body,
    });
    return handleResponse(response);
  },

  deleteRecipe: async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  toggleFeatured: async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}/featured`, {
      method: "PATCH",
      headers: createHeaders(),
    });
    return handleResponse(response);
  },
};

export const productsApi = {
  getAllProducts: async () => {
    const response = await fetch(PRODUCTS_API_URL, {
      method: "GET",
      headers: createHeaders(),
    });
    return handleResponse(response);
  },
};

export const prepareRecipeData = (
  formData,
  ingredients,
  directions,
  tips,
  tags,
  nutrition,
) => ({
  title: formData.title,
  slug: formData.slug,
  productId: formData.productId || formData.product,
  category: formData.category,
  description: formData.description,
  prepTime: parseInt(formData.prepTime),
  cookTime: parseInt(formData.cookTime),
  servings: parseInt(formData.servings),
  difficulty: formData.difficulty || "Easy",
  rating: parseFloat(formData.rating) || 0,
  reviews: parseInt(formData.reviews) || 0,
  featured: formData.featured || false,
  ingredients: ingredients.filter((ing) => ing.trim()),
  directions: directions.filter((dir) => dir.trim()),
  tips: tips.filter((tip) => tip.trim()),
  tags,
  nutrition,
  imageName: typeof formData.image === "string" ? formData.image : undefined,
});

export default { recipeApi, productsApi, prepareRecipeData };
