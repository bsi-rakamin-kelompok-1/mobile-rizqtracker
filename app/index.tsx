import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import Background from '@/components/Background';
import Logo from '@/assets/images/Logo.svg';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

const Page = () => {
  const router = useRouter();

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
    <SafeAreaView style={{ flex: 1 }}>
      <Background>
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
      </Background>
    </SafeAreaView>
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
