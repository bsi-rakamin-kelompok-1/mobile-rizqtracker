import { create } from 'zustand';
import { storage } from '@/lib/storage';
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
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  initializeAuth: () => void;
}

// Create auth store
export const useAuthStore = create<AuthState>((set, get) => ({
  token: storage.getString('auth_token') || null,
  user: storage.getString('user_data') ? JSON.parse(storage.getString('user_data')!) : null,
  isLoading: false,
  error: null,
  isAuthenticated: !!storage.getString('auth_token'),

  // Initialize auth state from storage
  initializeAuth: () => {
    const token = storage.getString('auth_token');
    const userDataString = storage.getString('user_data');

    if (token && userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        set({
          token,
          user: userData,
          isAuthenticated: true
        });
      } catch (error) {
        // If parsing fails, clear storage
        storage.delete('auth_token');
        storage.delete('user_data');
        set({ token: null, user: null, isAuthenticated: false });
      }
    } else {
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
      storage.set('auth_token', token);
      storage.set('user_data', JSON.stringify(user));

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
  logout: () => {
    // Clear storage
    storage.delete('auth_token');
    storage.delete('user_data');

    // Reset state
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null
    });
  }
}));