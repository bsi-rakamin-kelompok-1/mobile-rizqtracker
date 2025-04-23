import { MMKV } from 'react-native-mmkv';

// Create a storage instance
export const storage = new MMKV({
  id: 'rizq-tracker-storage',
  encryptionKey: 'rizq-tracker-secure-key' // For encrypted storage
});