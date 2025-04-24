import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import Background from '@/components/Background';
import Logo from '@/assets/images/Logo.svg';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/auth-store';

SplashScreen.preventAutoHideAsync();

const Page = () => {
  const router = useRouter();
  const state = useAuthStore();

  console.log('Auth state:', state);

  const [fontsLoaded] = useFonts({});

  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        router.replace('./login');
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    if (fontsLoaded) {
      prepare();
    }
  }, [fontsLoaded, router]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style='light' backgroundColor={Colors.primary} />
        <View style={styles.content}>
          <View style={styles.topContainer}>
            <Logo />
            <View style={{ alignContent: 'center', alignItems: 'center' }}>
              <Text
                style={[
                  defaultStyles.header,
                  { color: Colors.secondary, textTransform: 'uppercase' },
                ]}
              >
                Rizq <Text style={{ color: 'white' }}>Tracker</Text>
              </Text>
              <Text style={[defaultStyles.subheader]}>
                Solusi bijak finansialmu!
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Background>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  topContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  logo: {
    marginBottom: 8,
  },
});

export default Page;
