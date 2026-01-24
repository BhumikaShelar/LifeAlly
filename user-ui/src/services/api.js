import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add user_id to headers if available
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('user_id');
  if (userId) {
    config.headers['User-Id'] = userId;
  }
  return config;
});

// Auth Services
export const authService = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),

  register: (name, email, password) =>
    api.post('/api/auth/register', { name, email, password }),
};

// Chat/Prediction Services
export const chatService = {
  predict: (domain, text, userId) =>
    api.post('/api/predict', {
      domain,
      text,
      user_id: userId,
    }),
};

export default api;