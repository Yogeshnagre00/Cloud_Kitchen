import axios from "axios";
import { logger } from "./logger";

// Fallback to localhost if env is not defined
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Axios instance
const API = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMessage = "Unknown error occurred";
    let status = null;
    let data = null;

    if (error?.response) {
      status = error.response.status;
      data = error.response.data;

      if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      switch (status) {
        case 401:
          logger.error("Unauthorized - Redirect to login");
          break;
        case 404:
          logger.error(`Endpoint not found: ${error.config?.url}`);
          break;
        case 500:
          logger.error(`Server error: ${errorMessage}`);
          break;
        default:
          logger.error(`API Error: ${status}`, { url: error.config?.url, data });
      }
    }

    return Promise.reject({ message: errorMessage, status, data });
  }
);

// Centralized API abstraction
const api = {
  auth: {
    login: (credentials) => API.post("/auth/login", credentials),
    signup: (userData) => API.post("/auth/signup", userData),
    logout: () => API.post("/auth/logout"),
    refresh: () => API.post("/auth/refresh"),
  },

  products: {
    getAll: () => API.get("/products"),
    getById: (id) => API.get(`/products/${id}`),
    create: (data) => API.post("/products", data),
    update: (id, data) => API.put(`/products/${id}`, data),
    delete: (id) => API.delete(`/products/${id}`),

    getSpecifications: (productId) => API.get(`/products/${productId}/specifications`),
    addSpecification: (productId, specData) => API.post(`/products/${productId}/specifications`, specData),
    updateSpecification: (productId, specId, specData) => API.put(`/products/${productId}/specifications/${specId}`, specData),
    deleteSpecification: (productId, specId) => API.delete(`/products/${productId}/specifications/${specId}`),

    getSpecificationTypes: () => API.get("/specification-types"),
    createSpecificationType: (typeData) => API.post("/specification-types", typeData),
  },

  orders: {
    getOrders: () => API.get("/orders"),
    createOrder: (orderData) => API.post("/orders", orderData),
    getOrder: (id) => API.get(`/orders/${id}`),
    cancelOrder: (id) => API.delete(`/orders/${id}`),
  },

  user: {
    getProfile: () => API.get("/users/me"),
    updateProfile: (profileData) => API.patch("/users/me", profileData),
    changePassword: (passwordData) => API.patch("/users/password", passwordData),
  },

  upload: {
    image: (formData) =>
      API.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
  },
};

export default api;
