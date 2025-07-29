import axios from 'axios';

const API_BASE_URL = import.meta.env.MODE === "development" ? 'http://localhost:5000/api' : '/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const getConfig = () => {
  const token = getAuthToken();
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  };
};

export const getPublicSessions = async (params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/sessions`, { params }); 
  return response.data;
};

export const getMySessions = async (params = {}) => {
  const config = getConfig(); 
  const response = await axios.get(`${API_BASE_URL}/my-sessions`, { ...config, params }); 
  return response.data;
};

export const getSessionById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/my-sessions/${id}`, getConfig());
  return response.data;
};

export const saveDraftSession = async (sessionData) => {
  const response = await axios.post(`${API_BASE_URL}/my-sessions/save-draft`, sessionData, getConfig());
  return response.data;
};

export const publishSession = async (sessionId) => {
  const response = await axios.post(`${API_BASE_URL}/my-sessions/publish`, { id: sessionId }, getConfig());
  return response.data;
};