/**
 * Blog API Service - Backend Integration
 */
import { API_BASE_URL as BASE_URL } from "./config";

const API_BASE_URL = `${BASE_URL}/blogs`;

const getAuthToken = () => localStorage.getItem("token");

const createHeaders = (isFormData = false) => {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }
  return data;
};

export const blogApi = {
  getAllBlogs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}${queryString ? `?${queryString}` : ""}`;
    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  getBlog: async (identifier) => {
    const response = await fetch(`${API_BASE_URL}/${identifier}`, {
      method: "GET",
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  createBlog: async (blogData, imageFile = null) => {
    let body,
      headers = createHeaders(!!imageFile);

    if (imageFile && imageFile instanceof File) {
      const formData = new FormData();
      Object.entries(blogData).forEach(([key, value]) => {
        if (value === undefined) return;
        if (key === "content" || key === "tags") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      formData.append("image", imageFile);
      body = formData;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(blogData);
    }

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers,
      body,
    });
    return handleResponse(response);
  },

  updateBlog: async (id, blogData, imageFile = null) => {
    let body,
      headers = createHeaders(!!imageFile);

    if (imageFile && imageFile instanceof File) {
      const formData = new FormData();
      Object.entries(blogData).forEach(([key, value]) => {
        if (value === undefined) return;
        if (key === "content" || key === "tags") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      formData.append("image", imageFile);
      body = formData;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(blogData);
    }

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers,
      body,
    });
    return handleResponse(response);
  },

  deleteBlog: async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: createHeaders(),
    });
    return handleResponse(response);
  },
};

export default blogApi;
