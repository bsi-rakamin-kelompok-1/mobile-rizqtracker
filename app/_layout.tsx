import { useEffect } from 'react';

import { useFonts } from 'expo-font';
import { Toaster } from 'sonner-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SplashScreenComponent from '@/components/SplashScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    'SF-Pro': require('@/assets/fonts/SF-Pro.ttf'),
    ...FontAwesome.font,
  });
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return <SplashScreenComponent />;
  }

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />

      <Stack.Screen
        name='register'
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerBackButtonMenuEnabled: false,
          headerBackVisible: false,
          headerStyle: { backgroundColor: Colors.primary },
        }}
      />

      <Stack.Screen
        name='login'
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerBackVisible: false,
          headerStyle: { backgroundColor: Colors.primary },
        }}
      />

      <Stack.Screen
        name='create-pin'
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerBackVisible: false,
          headerStyle: { backgroundColor: Colors.primary },
        }}
      />

      <Stack.Screen
        name='help'
        options={{ title: 'Help', presentation: 'modal' }}
      />

      <Stack.Screen
        name='(authenticated)/(tabs)'
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerBackVisible: false,
          headerShown: false,
          headerStyle: { backgroundColor: Colors.primary },
        }}
      />

      <Stack.Screen
        name='(authenticated)/(transaction)'
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerBackVisible: false,
          headerShown: false,
          headerStyle: { backgroundColor: Colors.primary },
        }} 
      />

      <Stack.Screen
        name='+not-found'
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerBackVisible: false,
          headerShown: false,
          headerStyle: { backgroundColor: Colors.primary },
        }} 
      />

    </Stack>
  );
};

const RootLayoutNav = () => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style='light' />
        <InitialLayout />
        <Toaster />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default RootLayoutNav;
