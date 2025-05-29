import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/auth`;

// Set auth token for axios requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

const getMe = async () => {
  if (!axios.defaults.headers.common["Authorization"]) {
    throw new Error("No authentication token set");
  }
  const response = await axios.get(`${API_URL}/me`);
  return response.data;
};

export default {
  setAuthToken,
  register,
  login,
  getMe,
};
