import axios from "axios";
import { logger } from "./logger";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach auth token if present
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

// Handle responses
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMessage = "Unknown error occurred";
    let status = null;
    let data = null;

    if (error?.response) {
      status = error.response.status;
      data = error.response.data;

      if (error.response.data && error.response.data.message) {
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
          break;
      }
    }

    return Promise.reject({ message: errorMessage, status, data });
  }
);

// Organized API endpoints
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
    create: (productData) => API.post("/products", productData),
    update: (id, productData) => API.put(`/products/${id}`, productData),
    delete: (id) => API.delete(`/products/${id}`),
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
};

export default api;
