import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin } from '@/lib/api/auth';

// Define user type
interface User {
  email: string;
  full_name: string;
  phone_number: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  account: {
    account_number: number;
    balance: number;
  };
}

// Define auth state
interface AuthState {
  isLoading: boolean;
  error: string | null;
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: User) => void;
}

// Create auth store
export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setUser: (user: User) => set({ user }),

  // Initialize auth state from storage
  initializeAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userDataString = await AsyncStorage.getItem('user_data');

      if (token && userDataString) {
        const userData = JSON.parse(userDataString);
        set({
          token,
          user: userData,
          isAuthenticated: true
        });
      } else {
        set({ token: null, user: null, isAuthenticated: false });
      }
    } catch (error) {
      // If parsing fails, clear storage
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      set({ token: null, user: null, isAuthenticated: false });
    }
  },

  // Login
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const { token, data: user } = await apiLogin({ email, password });

      if (!token) {
        throw new Error('Login failed. Please check your credentials.');
      }

      // Store token and user data
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(user));

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false
      });

      return user;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        'Login failed. Please check your credentials.';

      set({ isLoading: false, error: errorMessage, isAuthenticated: false });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      // Clear storage
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');

      // Reset state
      set({
        token: null,
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error during logout:', error);
      // Still reset the state even if storage clear fails
      set({
        token: null,
        user: null,
        isLoading: false,
        error: 'Logout error',
        isAuthenticated: false,
      });
    }
  }
}));