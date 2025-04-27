import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { format } from 'date-fns';
import Logo from '@/assets/images/Logo.svg';
import { formatCurrency, formatSnakeCase } from '@/utils/formatters';

const TransactionResultPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract params
  const status = params.status as string;
  const amount = params.amount ? Number(params.amount) : 0;
  const transactionType = (params.transaction_type as string) || 'topup';
  const method = params.method as string;
  const referenceNumber = params.referenceNumber as string;
  const createdAt = params.createdAt as string;
  const notes = params.notes as string;
  const errorMessage = params.errorMessage as string;

  // Transfer specific params
  const recipientAccount = params.recipient_account as string;
  const recipientName = params.recipient_name as string;

  const isSuccess = status === 'success';
  const isTransfer = transactionType === 'transfer';

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy - HH:mm:ss');
    } catch (error) {
      return dateString;
    }
  };

  const handleFinish = () => {
    router.replace('/(authenticated)/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='light' />

      <View style={styles.header}>
        <Logo width={120} height={40} style={styles.logo} />
      </View>

      <View style={styles.content}>
        <View style={styles.resultContainer}>
          {/* Status Icon */}
          <View
            style={[
              styles.statusIconContainer,
              { backgroundColor: isSuccess ? Colors.primary : Colors.error },
            ]}
          >
            <Ionicons
              name={isSuccess ? 'checkmark' : 'close'}
              size={32}
              color='white'
            />
          </View>

          {/* Result Message */}
          <Text style={styles.resultTitle}>
            {isSuccess
              ? 'Alhamdulillah, transaksi kamu berhasil!'
              : 'Maaf, transaksi gagal'}
          </Text>

          {isSuccess && createdAt && (
            <Text style={styles.transactionDate}>{formatDate(createdAt)}</Text>
          )}

          {!isSuccess && errorMessage && (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          )}

          {/* Transaction Details - Only show on success */}
          {isSuccess && (
            <View style={styles.transactionDetails}>
              {/* Amount */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nominal</Text>
                <Text style={styles.detailValue}>{formatCurrency(amount)}</Text>
              </View>

              {/* Transaction Type */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tipe Transaksi</Text>
                <Text style={styles.detailValue}>
                  {isTransfer ? 'Transfer' : 'Top Up'}
                </Text>
              </View>

              {/* For Transfer: Recipient Name */}
              {isTransfer && recipientName && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nama Penerima</Text>
                  <Text style={styles.detailValue}>{recipientName}</Text>
                </View>
              )}

              {/* For Transfer: Recipient Account */}
              {isTransfer && recipientAccount && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nomor Rekening</Text>
                  <Text style={styles.detailValue}>{recipientAccount}</Text>
                </View>
              )}

              {/* Method (Top Up method or Transfer category) */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {isTransfer ? 'Kategori' : 'Metode Top Up'}
                </Text>
                <Text style={styles.detailValue}>
                  {formatSnakeCase(method)}
                </Text>
              </View>

              {/* Reference Number */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nomor Referensi</Text>
                <Text style={styles.detailValue}>{referenceNumber}</Text>
              </View>

              {/* Notes - Optional */}
              {notes && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Catatan</Text>
                  <Text style={styles.detailValue}>{notes}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>
            {isSuccess ? 'Selesai' : 'Kembali'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TransactionResultPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 72,
    backgroundColor: Colors.primary,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 30, // Add extra padding at the bottom
  },
  logo: {
    alignSelf: 'center', // Additional alignment to ensure centering
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  resultContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 24,
  },
  statusIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: Colors.error,
    marginTop: 8,
    textAlign: 'center',
  },
  transactionDate: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 24,
  },
  transactionDetails: {
    width: '100%',
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E6E6E6',
    paddingTop: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.gray,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark,
    maxWidth: '60%',
    textAlign: 'right',
  },
  buttonContainer: {
    padding: 24,
    backgroundColor: 'white',
    paddingBottom: 72,
  },
  finishButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
