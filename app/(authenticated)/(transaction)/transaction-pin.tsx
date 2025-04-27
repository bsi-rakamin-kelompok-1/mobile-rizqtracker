import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/Colors';
import { topupApi } from '@/lib/api/transaction/topup';
import { transferApi } from '@/lib/api/transaction/transfer';
import PinInput from '@/components/pin/PinInput';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAdaptiveToast } from '@/utils/toast';

const TransactionPinPage = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const toast = useAdaptiveToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { token } = useAuthStore();
  const [shouldShake, setShouldShake] = useState(false);

  // Extract common params
  const amount = params.amount ? Number(params.amount) : 0;
  const notes = params.notes as string;

  // Extract transaction type
  const transactionType =
    (params.transaction_type as 'topup' | 'transfer') || 'topup';

  // Extract specific params based on transaction type
  const method = params.method as
    | 'debit_card'
    | 'credit_card'
    | 'bank_transfer';
  const recipientAccount = params.recipient_account as string;
  const category = params.category as string;

  const handlePinComplete = async (pin: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setShouldShake(false);

      let result;

      if (transactionType === 'transfer') {
        // Handle transfer transaction
        result = await transferApi(
          {
            recipient_account_number: parseInt(recipientAccount),
            transfer_category: category,
            amount: amount,
            pin: pin,
            notes: notes || '',
          },
          token!
        );
      } else {
        // Handle topup transaction
        result = await topupApi(
          {
            topup_method: method,
            amount: amount,
            notes: notes || '',
            pin: pin,
          },
          token!
        );
      }

      // Common success navigation
      router.replace({
        pathname: '/(authenticated)/(transaction)/transaction-result',
        params: {
          status: 'success',
          transactionId: result.data.id,
          amount: result.data.amount.toString(),
          transaction_type: transactionType,
          method:
            transactionType === 'transfer'
              ? category
              : 'topup_method' in result.data ? result.data.topup_method : undefined,
          referenceNumber: result.data.reference_number,
          createdAt: result.data.created_at,
          notes: result.data.notes || '',
          recipient_account:
            transactionType === 'transfer'
              ? 'recipient_account_number' in result.data
                ? result.data.recipient_account_number
                : undefined
              : undefined,
          recipient_name: params.recipient_name,
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
  // const handleFailure = () => {
  //   router.replace({
  //     pathname: './topup-result',
  //     params: {
  //       status: 'failed',
  //       errorMessage: errorMessage || 'Transaksi dibatalkan',
  //       transaction_type: transactionType,
  //     },
  //   });
  // };

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
              // onCancel={() => handleFailure()}
              resetOnError={shouldShake}
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

export default TransactionPinPage;
