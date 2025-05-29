import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/collections`;

const getAllCollections = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const getDriverCollections = async (driverId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/driver/${driverId}`, config);
  return response.data;
};

const createCollection = async (collectionData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, collectionData, config);
  return response.data;
};

export default {
  getAllCollections,
  getDriverCollections,
  createCollection,
};
