import axios from 'axios';

const api = axios.create({
  // An empty VITE_API_URL keeps production API requests on the deployed origin.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('comparekart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      if (localStorage.getItem('comparekart_token')) {
        localStorage.removeItem('comparekart_token');
        localStorage.removeItem('comparekart_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
