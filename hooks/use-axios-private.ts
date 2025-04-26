import { useEffect } from 'react';
import axios from '@/lib/axios-private';
import { useAuthStore } from '@/store/auth-store';
import { usePathname } from 'expo-router'; // Use expo-router for React Native

const useAxiosPrivate = () => {
  const authStore = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use(
      (config) => {
        const requestPath = new URL(config.url || '', config.baseURL).pathname;
        const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
        const isPublicPath = publicPaths.some(path => requestPath.includes(path));

        if (!isPublicPath && !config.headers.Authorization) {
          console.log(`Adding auth token to request: ${config.url}, token: ${authStore.token}`);
          
          config.headers.Authorization = `Bearer ${authStore.token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
    };
  }, [authStore, pathname]);

  return axios;
};

export default useAxiosPrivate;