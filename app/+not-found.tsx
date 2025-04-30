import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { Image } from 'expo-image';

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#FFFFFF' />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name='alert-circle-outline'
            size={120}
            color={Colors.primaryMuted}
          />
        </View>

        <Text style={styles.title}>Halaman Tidak Ditemukan</Text>

        <Text style={styles.message}>
          Sepertinya Anda tersesat. Halaman yang Anda cari tidak dapat
          ditemukan.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/(authenticated)/(tabs)')}
          >
            <Ionicons
              name='home'
              size={20}
              color='#FFFFFF'
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Kembali ke Beranda</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 280,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
