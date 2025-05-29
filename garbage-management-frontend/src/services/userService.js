import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/users`;

const getAllUsers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const getUser = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/${userId}`, config);
  return response.data;
};

const updateUser = async (userId, userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/${userId}`, userData, config);
  return response.data;
};

const deleteUser = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${API_URL}/${userId}`, config);
  return response.data;
};

export default {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
