import api from "./axios";

export const productService = {
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get("/products", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getProductsByCategory: async (category, params = {}) => {
    try {
      const response = await api.get(`/products/category/${category}`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getProductStats: async () => {
    try {
      const response = await api.get("/products/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post("/products", productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deactivateProduct: async (id) => {
    try {
      const response = await api.patch(`/products/${id}/deactivate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  activateProduct: async (id) => {
    try {
      const response = await api.patch(`/products/${id}/activate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  bulkUpdateStock: async (updates) => {
    try {
      const response = await api.patch("/products/bulk-stock", { updates });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // FIXED: now uses the axios instance instead of raw fetch
  // - correct baseURL from axios config
  // - auth token attached automatically by axios interceptor
  // - axios DELETE body passed via `data:` not `body:`
  deleteProductImages: async (productId, publicIds) => {
    try {
      const response = await api.delete(`/products/${productId}/images`, {
        data: { publicIds },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
