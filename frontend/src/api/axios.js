import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 15000,
});

// Request interceptor: attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('inkwave_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 and HTML fallback responses
api.interceptors.response.use(
  (response) => {
    if (typeof response.data === 'string' && response.data.startsWith('<!DOCTYPE html>')) {
      return Promise.reject(new Error('API returned HTML instead of JSON. Check VITE_API_URL.'));
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('inkwave_token');
      // Let individual callers handle navigation
    }
    return Promise.reject(error);
  }
);

export default api;
