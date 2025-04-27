import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  StatusBar as RNStatusBar,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/Colors';
import { topupApi } from '@/lib/api/transaction/topup';
import PinInput from '@/components/pin/PinInput';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAdaptiveToast } from '@/utils/toast';

const TopUpPinPage = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const toast = useAdaptiveToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { token } = useAuthStore();
  const [shouldShake, setShouldShake] = useState(false);

  // Extract params
  const amount = params.amount ? Number(params.amount) : 0;
  const method = params.method as
    | 'debit_card'
    | 'credit_card'
    | 'bank_transfer';
  const notes = params.notes as string;

  const handlePinComplete = async (pin: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null); // Clear any previous errors
      setShouldShake(false); // Reset shake state

      const result = await topupApi(
        {
          topup_method: method,
          amount: amount,
          notes: notes || '',
          pin: pin,
        },
        token!
      );

      // Navigate to success page on successful API call
      router.replace({
        pathname: './topup-result',
        params: {
          status: 'success',
          transactionId: result.data.id,
          amount: result.data.amount.toString(),
          method: result.data.topup_method,
          referenceNumber: result.data.reference_number,
          createdAt: result.data.created_at,
          notes: result.data.notes || '',
        },
      });
    } catch (error: any) {
      // Set error message and trigger shake
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'PIN tidak valid. Silakan coba lagi.';

      setErrorMessage(message);
      setShouldShake(true); // Only set to true when there's an error
      toast.error(message);

      // Don't navigate to result page - let the user try again
    } finally {
      setIsLoading(false);
    }
  };

  // Only call this when user explicitly cancels or max attempts reached
  const handleFailure = () => {
    router.replace({
      pathname: './topup-result',
      params: {
        status: 'failed',
        errorMessage: errorMessage || 'Transaksi dibatalkan',
      },
    });
  };

  return (
    <>
      <StatusBar style='light' backgroundColor={Colors.primary} />
      <SafeAreaView style={styles.container}>
        <View
          style={[
            styles.header,
            {
              paddingTop:
                Platform.OS === 'android'
                  ? insets.top > 0
                    ? insets.top
                    : RNStatusBar.currentHeight
                  : 0,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name='arrow-back' size={24} color='white' />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Masukkan PIN</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.content}>
            <PinInput
              confirmLabel='Masukkan PIN untuk konfirmasi'
              onComplete={handlePinComplete}
              isConfirmationMode={true}
              loading={isLoading}
              pinLength={6}
              resetOnError={shouldShake} // Only pass true when shouldShake is true
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 72,
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 4,
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
  errorContainer: {
    backgroundColor: '#FFEBEB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 20,
    padding: 12,
  },
  cancelButtonText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TopUpPinPage;
