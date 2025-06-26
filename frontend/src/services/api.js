import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
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
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error occurred";

    switch (error.response?.status) {
      case 401:
        console.error("Unauthorized - Redirect to login");
        break;
      case 404:
        console.error("Endpoint not found:", error.config.url);
        break;
      case 500:
        console.error("Server error:", errorMessage);
        break;
      default:
        console.error("API Error:", {
          status: error.response?.status,
          message: errorMessage,
          url: error.config?.url,
        });
    }

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      originalError: error,
    });
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
