import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  BackHandler,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAdaptiveToast } from '@/utils/toast';
import { useAuthStore } from '@/store/auth-store';
import { setPinApi } from '@/lib/api/pin';
import Colors from '@/constants/Colors';
import PinPageHeader from '@/components/pin/PinPageHeader';
import PinInput from '@/components/pin/PinInput';

const Page = () => {
  const router = useRouter();
  const toast = useAdaptiveToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [firstPin, setFirstPin] = useState<string | null>(null);
  const [step, setStep] = useState<'first' | 'confirm'>('first');
  const { token } = useAuthStore((state) => ({
    token: state.token,
  }));

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        toast.info('PIN wajib diisi', {
          description: 'Silakan isi PIN untuk melanjutkan',
        });
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  const handleFirstPinComplete = (pin: string) => {
    setFirstPin(pin);
    setStep('confirm');
  };

  const handleConfirmPinComplete = async (pin: string) => {
    if (pin !== firstPin) {
      toast.error('PIN tidak cocok', {
        description: 'PIN konfirmasi tidak sama dengan PIN pertama',
        duration: 2000,
      });
      setErrorState(true);
      setTimeout(() => {
        setErrorState(false);
        setStep('first');
        setFirstPin(null);
      }, 1000);
      return;
    }

    try {
      setIsLoading(true);
      setErrorState(false);

      const { success } = await setPinApi(
        {
          pin,
          confirm_pin: pin,
        },
        token!
      );

      if (!success) {
        throw new Error('Gagal membuat PIN');
      }

      toast.success('PIN berhasil dibuat', {
        description: 'Selamat datang di aplikasi Rizqtracker!',
        duration: 3000,
      });

      router.replace('./(authenticated)/(tabs)/');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        'Gagal membuat PIN, silakan coba lagi';

      setErrorState(true);
      toast.error(errorMessage, {
        duration: 2000,
      });

      setTimeout(() => {
        setStep('first');
        setFirstPin(null);
        setErrorState(false);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='light' backgroundColor={Colors.primary} />

      <PinPageHeader title='Buat PIN' />

      <View style={styles.contentContainer}>
        <View style={styles.content}>
          {step === 'first' && (
            <>
              <Text style={styles.stepIndicator}>Langkah 1 dari 2</Text>
              <PinInput
                label='Masukkan PIN baru'
                onComplete={handleFirstPinComplete}
                loading={isLoading}
                pinLength={6}
                isConfirmationMode={false}
                resetOnError={errorState}
              />
            </>
          )}

          {step === 'confirm' && (
            <>
              <Text style={styles.stepIndicator}>Langkah 2 dari 2</Text>
              <PinInput
                label='Konfirmasi PIN'
                onComplete={handleConfirmPinComplete}
                loading={isLoading}
                pinLength={6}
                isConfirmationMode={false}
                resetOnError={errorState}
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: 'center',
  },
  stepIndicator: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default Page;
