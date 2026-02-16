// src/api/productService.js
import api from "./axios";

export const productService = {
  // Get all products with filters
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get("/products", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single product
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get products by category
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

  // Get product stats
  getProductStats: async () => {
    try {
      const response = await api.get("/products/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create product
  createProduct: async (productData) => {
    try {
      const response = await api.post("/products", productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Deactivate product
  deactivateProduct: async (id) => {
    try {
      const response = await api.patch(`/products/${id}/deactivate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Activate product
  activateProduct: async (id) => {
    try {
      const response = await api.patch(`/products/${id}/activate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bulk update stock
  bulkUpdateStock: async (updates) => {
    try {
      const response = await api.patch("/products/bulk-stock", { updates });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
