import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('inkwave_token');
      // Let individual callers handle navigation
    }
    return Promise.reject(error);
  }
);

export default api;
