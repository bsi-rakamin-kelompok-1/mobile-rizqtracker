import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  set: async (key: string, value: any) => {
    try {
      if (typeof value === 'string') {
        await AsyncStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  getString: (key: string) => {
    try {
      return AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },
  getBoolean: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value === 'true';
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  },
  getNumber: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? parseFloat(value) : 0;
    } catch (error) {
      console.error('Storage error:', error);
      return 0;
    }
  },
  delete: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
};