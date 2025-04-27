import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/Colors';
import { topupApi } from '@/lib/api/transaction/topup';
import PinInput from '@/components/pin/PinInput';

const TopUpPinPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthStore();

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

      const result = await topupApi(
        {
          topup_method: method,
          amount: amount,
          notes: notes || '',
          pin: pin,
        },
        token!
      );

      // Navigate to success page
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

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to process top up. Please try again.';

      // Navigate to failed page
      router.replace({
        pathname: './topup-result',
        params: {
          status: 'failed',
          errorMessage,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='light' />

      <View style={styles.header}>
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
            label='Masukkan PIN untuk konfirmasi'
            onComplete={handlePinComplete}
            loading={isLoading}
            pinLength={6}
            onCancel={() => router.back()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tertiaryMuted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 50,
    marginTop: 20,
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
});

export default TopUpPinPage;
