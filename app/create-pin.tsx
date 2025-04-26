import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, BackHandler } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAdaptiveToast } from '@/utils/toast';
import { useAuthStore } from '@/store/auth-store';
import { setPinApi } from '@/lib/api/pin';
import Colors from '@/constants/Colors';

// Import our new components
import PinPageHeader from '@/components/pin/PinPageHeader';
import PinInput from '@/components/pin/PinInput';

const Page = () => {
  const router = useRouter();
  const toast = useAdaptiveToast();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthStore((state) => ({
    token: state.token,
  }));

  // Prevent going back with hardware button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        toast.info('PIN setup required', {
          description: 'Please complete pin setup to continue',
        });
        return true; // Prevent default behavior
      }
    );

    return () => backHandler.remove();
  }, []);

  const handlePinComplete = async (pin: string) => {
    try {
      setIsLoading(true);

      const { success } = await setPinApi(
        {
          pin,
          confirm_pin: pin,
        },
        token!
      );

      if (!success) {
        throw new Error('Failed to create PIN. Please try again.');
      }

      toast.success('PIN created successfully!', {
        description: 'Welcome to RizqTracker',
        duration: 3000,
      });

      router.replace('./(authenticated)/(tabs)/');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        'Failed to create PIN. Please try again.';
      toast.error('Failed', { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='light' backgroundColor={Colors.primary} />

      <PinPageHeader title='Create PIN' />

      <View style={styles.contentContainer}>
        <View style={styles.content}>
          <PinInput
            label='Enter your PIN'
            confirmLabel='Confirm your PIN'
            onComplete={handlePinComplete}
            isConfirmationMode={true}
            loading={isLoading}
            pinLength={6}
          />
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
});

export default Page;
