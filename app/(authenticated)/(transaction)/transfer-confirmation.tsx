import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatSnakeCase } from '@/utils/formatters';
import { useAuthStore } from '@/store/auth-store';
import { transferCategories, TransferCategory } from '@/types/transaction';

const TransferConfirmationPage = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuthStore();

  // Extract params
  const recipientName = params.recipient_name as string;
  const recipientAccount = params.recipient_account as string;
  const amount = params.amount ? Number(params.amount) : 0;
  const category = params.category as TransferCategory;
  const notes = params.notes as string;

  // Get the category label from transferCategories
  const getCategoryLabel = (categoryId: TransferCategory): string => {
    const foundCategory = transferCategories.find(
      (item) => item.id === categoryId
    );
    return foundCategory ? foundCategory.label : categoryId;
  };

  const handleConfirm = () => {
    // Navigate to PIN page
    router.push({
      pathname: '/(authenticated)/(transaction)/transaction-pin',
      params: {
        recipient_name: recipientName,
        recipient_account: recipientAccount,
        amount: amount,
        category: category,
        notes: notes,
        transaction_type: 'transfer', // Add this to identify transaction type
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
          <Text style={styles.headerTitle}>Konfirmasi Transfer</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Nama Penerima</Text>
              <Text style={styles.detailValue}>{recipientName}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Rekening Tujuan</Text>
              <Text style={styles.detailValue}>{recipientAccount}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Nominal Transfer</Text>
              <Text style={styles.detailValue}>{formatCurrency(amount)}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Rekening Sumber</Text>
              <Text style={styles.detailValue}>
                {user?.account?.account_number}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Kategori</Text>
              <Text style={styles.detailValue}>
                {getCategoryLabel(category)}
              </Text>
            </View>

            {notes && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Catatan</Text>
                <Text style={styles.detailValue}>{notes}</Text>
              </View>
            )}
          </View>

          <View style={styles.warningContainer}>
            <Ionicons
              name='information-circle'
              size={18}
              color={Colors.primary}
            />
            <Text style={styles.warningText}>
              Pastikan data penerima sudah benar sebelum melanjutkan transaksi
            </Text>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Konfirmasi</Text>
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
};

export default TransferConfirmationPage;

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
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  contentContainer: {
    padding: 24,
  },
  detailsContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.gray,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark,
    textAlign: 'right',
    maxWidth: '60%',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F6',
    padding: 12,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 12,
    color: Colors.primary,
    marginLeft: 8,
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
