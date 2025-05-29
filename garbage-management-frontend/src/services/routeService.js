import axios from "axios";

const API_URL = "http://localhost:5000/api/routes";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to inject auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration or invalid token
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

// Route API functions
const RouteService = {
  getAllRoutes: async () => {
    try {
      const response = await apiClient.get("/");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch routes"
      );
    }
  },

  getDriverRoutes: async (driverId) => {
    try {
      const response = await apiClient.get(`/driver/${driverId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch driver routes"
      );
    }
  },

  getRoute: async (routeId) => {
    try {
      const response = await apiClient.get(`/${routeId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch route");
    }
  },

  createRoute: async (routeData) => {
    try {
      const response = await apiClient.post("/", routeData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create route"
      );
    }
  },

  updateRouteStatus: async (routeId, statusData) => {
    try {
      const response = await apiClient.put(`/${routeId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update route status"
      );
    }
  },

  deleteRoute: async (routeId) => {
    try {
      const response = await apiClient.delete(`/${routeId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete route"
      );
    }
  },
};

export default RouteService;
