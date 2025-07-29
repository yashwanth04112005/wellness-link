import axios from 'axios';

const API_BASE_URL = import.meta.env.MODE === "development" ? 'http://localhost:5000/api' : '/api';
const API_URL = `${API_BASE_URL}/auth`;

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};