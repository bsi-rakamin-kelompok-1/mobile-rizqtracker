import axios from 'axios';

const BASE_URL = 'https://kelompok1.serverku.org';

// Create a custom instance
export const privateAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
privateAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    // Handle errors globally here
    const message = error.response?.data?.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// Request interceptor (can be used to add auth tokens later)
// privateAxios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('auth_token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default privateAxios;