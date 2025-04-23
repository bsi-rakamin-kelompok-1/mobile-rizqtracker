import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Link, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import SplashScreenComponent from '@/components/SplashScreen';
// import '@fontsource/geist-sans';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import * as SecureStore from 'expo-secure-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { UserInactivityProvider } from '@/context/UserInactivity';

const queryClient = new QueryClient();

// Cache the Clerk JWT
// const tokenCache = {
//   async getToken(key: string) {
//     try {
//       return SecureStore.getItemAsync(key);
//     } catch (err) {
//       return null;
//     }
//   },
//   async saveToken(key: string, value: string) {
//     try {
//       return SecureStore.setItemAsync(key, value);
//     } catch (err) {
//       return;
//     }
//   },
// };

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    'SF-Pro': require('@/assets/fonts/SF-Pro.ttf'),
    ...FontAwesome.font,
  });
  const router = useRouter();
  const segments = useSegments();
  // const { isLoaded, isSignedIn } = useAuth();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return <SplashScreenComponent />;
  }

  // useEffect(() => {
  //   if (!isLoaded) return;

  //   const inAuthGroup = segments[0] === '(authenticated)';

  //   if (isSignedIn && !inAuthGroup) {
  //     router.replace('/(authenticated)/(tabs)/home');
  //   } else if (!isSignedIn) {
  //     router.replace('/');
  //   }
  // }, [isSignedIn]);

  // if (!loaded || !isLoaded) {

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
        name='help'
        options={{ title: 'Help', presentation: 'modal' }}
      />

      <Stack.Screen
        name='(authenticated)/(tabs)'
        options={{ headerShown: false }}
      />

      {/* <Stack.Screen
        name='(authenticated)/crypto/[id]'
        options={{
          title: '',
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name='arrow-back' size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
          headerLargeTitle: true,
          headerTransparent: true,
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity>
                <Ionicons
                  name='notifications-outline'
                  color={Colors.dark}
                  size={30}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name='star-outline' color={Colors.dark} size={30} />
              </TouchableOpacity>
            </View>
          ),
        }}
      /> */}

      {/* <Stack.Screen
        name='(authenticated)/(modals)/lock'
        options={{ headerShown: false, animation: 'none' }}
      /> */}

      {/* <Stack.Screen
        name='(authenticated)/(modals)/account'
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          title: '',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name='close-outline' size={34} color={'#fff'} />
            </TouchableOpacity>
          ),
        }}
      /> */}
    </Stack>
  );
};

const RootLayoutNav = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <UserInactivityProvider> */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style='light' />
        <InitialLayout />
      </GestureHandlerRootView>
      {/* </UserInactivityProvider> */}
    </QueryClientProvider>
  );
};

export default RootLayoutNav;
