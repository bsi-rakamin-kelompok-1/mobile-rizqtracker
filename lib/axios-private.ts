import axios from 'axios';

const BASE_URL = 'https://kelompok1.serverku.org';

// Create a custom instance
export const privateAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default privateAxios;