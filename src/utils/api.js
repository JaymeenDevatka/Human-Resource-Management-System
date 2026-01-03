import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api', // This will be proxied to http://localhost:5000 in development
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle different HTTP status codes
      if (error.response.status === 401) {
        // Handle unauthorized access (e.g., redirect to login)
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      // You can add more error handling here
    }
    return Promise.reject(error);
  }
);

export default api;
