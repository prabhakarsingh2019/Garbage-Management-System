import axios from "axios";

const API_URL = "http://localhost:5000/api/bins";

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

const getAllBins = async () => {
  try {
    const response = await apiClient.get("/");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch bins");
  }
};

const getNearbyBins = async (longitude, latitude, maxDistance = 5000) => {
  try {
    const response = await apiClient.get("/nearby", {
      params: {
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
        maxDistance: parseInt(maxDistance),
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch nearby bins"
    );
  }
};

const getBin = async (binId) => {
  try {
    const response = await apiClient.get(`/${binId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch bin");
  }
};

const createBin = async (binData) => {
  try {
    const response = await apiClient.post("/", binData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create bin");
  }
};

const updateBin = async (binId, binData) => {
  try {
    const response = await apiClient.put(`/${binId}`, binData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update bin");
  }
};

const deleteBin = async (binId) => {
  try {
    const response = await apiClient.delete(`/${binId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete bin");
  }
};

export default {
  getAllBins,
  getNearbyBins,
  getBin,
  createBin,
  updateBin,
  deleteBin,
};
