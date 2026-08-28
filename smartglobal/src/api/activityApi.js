/**
 * Activity API Service - anonymous user-action tracking
 */
import { API_BASE_URL as BASE_URL } from "./config";
import { getAnonIdentity } from "../lib/anon";

const API_BASE_URL = `${BASE_URL}/activity`;

const getAuthToken = () => localStorage.getItem("token");

const createHeaders = () => {
  const headers = { "Content-Type": "application/json" };
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

export const activityApi = {
  // Fire-and-forget — tracking must never block or break the user's action.
  log: (action, { targetId, targetTitle, meta } = {}) => {
    const { anonId, anonName } = getAnonIdentity();
    fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anonId,
        anonName,
        action,
        targetId,
        targetTitle,
        meta,
        path: window.location.pathname,
      }),
    }).catch(() => {});
  },

  getLogs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}${queryString ? `?${queryString}` : ""}`;
    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: "GET",
      headers: createHeaders(),
    });
    return handleResponse(response);
  },
};

export default activityApi;
