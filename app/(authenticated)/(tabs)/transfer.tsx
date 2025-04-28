import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { useKeyboardVisibility } from '@/hooks/useKeyboardVisibility';
import { useAuthStore } from '@/store/auth-store';
import { useAdaptiveToast } from '@/utils/toast';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { TransferCategory, transferCategories } from '@/types/transaction';

interface RecentRecipient {
  full_name: string;
  account_number: number;
}

const Transfer = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const axios = useAxiosPrivate();
  const isKeyboardVisible = useKeyboardVisibility();
  const toast = useAdaptiveToast();
  const { user } = useAuthStore();

  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [recentRecipients, setRecentRecipients] = useState<RecentRecipient[]>(
    []
  );
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<TransferCategory>('needs');

  useEffect(() => {
    fetchRecentRecipients();
  }, []);

  const fetchRecentRecipients = async () => {
    setLoadingRecipients(true);
    try {
      const response = await axios.get('/v1/accounts/recent-recipients');
      setRecentRecipients(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch recent recipients:', error);
      toast.error('Gagal memuat penerima terakhir');
    } finally {
      setLoadingRecipients(false);
    }
  };

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');

    if (numericValue) {
      const numericAmount = parseInt(numericValue, 10);
      const formatted = new Intl.NumberFormat('id-ID').format(numericAmount);

      setAmount(formatted);
    } else {
      setAmount('');
    }
  };

  const handleSelectRecipient = (recipient: RecentRecipient) => {
    const recipientAccountNumber = recipient.account_number.toString();

    setAccountNumber(recipientAccountNumber.substring(0, 9));
  };

  const handleTransfer = async () => {
    if (!accountNumber || !amount) {
      toast.error('Mohon lengkapi data', {
        description: 'Nomor rekening dan nominal transfer wajib diisi',
      });
      return;
    }

    if (accountNumber.length !== 9) {
      toast.error('Format nomor rekening tidak valid', {
        description: 'Nomor rekening harus 9 digit',
      });
      return;
    }

    if (accountNumber === user?.account?.account_number?.toString()) {
      toast.error('Transfer tidak diizinkan', {
        description: 'Anda tidak dapat melakukan transfer ke rekening sendiri',
      });
      return;
    }

    const numericAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (numericAmount > (user?.account?.balance || 0)) {
      toast.error('Saldo tidak mencukupi', {
        description: 'Nominal transfer melebihi saldo yang tersedia',
      });
      return;
    }

    try {
      const response = await axios.get(`/v1/accounts/${accountNumber}`);

      router.push({
        pathname: '/(authenticated)/(transaction)/transfer-confirmation',
        params: {
          recipient_name: response.data.data.full_name,
          recipient_account: accountNumber,
          amount: amount.replace(/[^0-9]/g, ''),
          category: selectedCategory,
          notes: notes,
        },
      });
    } catch (error: any) {
      if (error?.response?.status === 404) {
        toast.error('Rekening tujuan tidak ditemukan');
      } else {
        toast.error('Gagal memverifikasi rekening', {
          description: error?.message || 'Silakan coba lagi nanti',
        });
      }
    }
  };

  // Generate avatar from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatAccountNumber = (number: number) => {
    return number
      .toString()
      .replace(/(\d{3})/g, '$1 ')
      .trim();
  };

  const handleAccountNumberChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');

    if (numericValue.length <= 9) {
      setAccountNumber(numericValue);
    }
  };

  return (
    <>
      <StatusBar barStyle='light-content' backgroundColor={Colors.primary} />
      <SafeAreaView style={[styles.container]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View
            style={[
              styles.header,
              {
                paddingTop:
                  Platform.OS === 'android'
                    ? insets.top > 0
                      ? insets.top
                      : StatusBar.currentHeight
                    : 0,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name='arrow-back' size={24} color='white' />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Transfer</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            style={styles.content}
            keyboardShouldPersistTaps='handled'
          >
            <View style={styles.formContainer}>
              {/* Account Number Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nomor Rekening Tujuan</Text>
                <View style={styles.accountInputContainer}>
                  <TextInput
                    style={styles.accountInput}
                    value={accountNumber}
                    onChangeText={handleAccountNumberChange}
                    keyboardType='numeric'
                    placeholder='700500121'
                    placeholderTextColor='#AAAAAA'
                    maxLength={9}
                  />
                </View>
              </View>

              {/* Transfer Amount Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nominal Transfer</Text>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>Rp</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={handleAmountChange}
                    keyboardType='numeric'
                    placeholder='0'
                    placeholderTextColor='#AAAAAA'
                  />
                </View>
                <Text style={styles.balanceInfo}>
                  Saldo Tersedia: Rp{' '}
                  {new Intl.NumberFormat('id-ID').format(
                    user?.account?.balance || 0
                  )}
                </Text>
              </View>

              {/* Transfer Category */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Kategori Transfer</Text>
                <View style={styles.categoriesContainer}>
                  {transferCategories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryItem,
                        selectedCategory === category.id &&
                          styles.selectedCategory,
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <Ionicons
                        name={category.icon as any}
                        size={20}
                        color={
                          selectedCategory === category.id
                            ? 'white'
                            : Colors.primary
                        }
                        style={styles.categoryIcon}
                      />
                      <Text
                        style={[
                          styles.categoryText,
                          selectedCategory === category.id &&
                            styles.selectedCategoryText,
                        ]}
                      >
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Recent Recipients */}
              <View style={styles.recentRecipientsContainer}>
                <Text style={styles.label}>Penerima Terakhir</Text>
                {loadingRecipients ? (
                  <ActivityIndicator
                    color={Colors.primary}
                    style={styles.loadingIndicator}
                  />
                ) : recentRecipients.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.recipientsScrollContainer}
                  >
                    {recentRecipients.map((recipient) => (
                      <TouchableOpacity
                        key={recipient.account_number}
                        style={styles.recipientItem}
                        onPress={() => handleSelectRecipient(recipient)}
                      >
                        <View style={styles.recipientAvatar}>
                          <Text style={styles.recipientInitials}>
                            {getInitials(recipient.full_name)}
                          </Text>
                        </View>
                        <Text
                          style={styles.recipientName}
                          numberOfLines={1}
                          ellipsizeMode='tail'
                        >
                          {recipient.full_name}
                        </Text>
                        <Text style={styles.recipientAccount}>
                          {formatAccountNumber(recipient.account_number)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={styles.noRecipientsText}>
                    Belum ada penerima terakhir
                  </Text>
                )}
              </View>

              {/* Notes Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Catatan (opsional)</Text>
                <TextInput
                  style={styles.notesInput}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder='Masukkan catatan transfer'
                  placeholderTextColor='#AAAAAA'
                  multiline
                />
              </View>
            </View>

            {!isKeyboardVisible && (
              <View style={styles.buttonContainer}>
                <Button
                  style={[
                    styles.transferButton,
                    !accountNumber || !amount ? styles.disabledButton : {},
                  ]}
                  onPress={handleTransfer}
                  disabled={!accountNumber || !amount}
                >
                  <Text style={styles.transferButtonText}>Lanjut</Text>
                </Button>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default Transfer;

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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: Colors.dark,
    marginBottom: 8,
    fontWeight: '500',
  },
  accountInputContainer: {
    backgroundColor: '#F0F9F6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  accountInput: {
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.dark,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    color: Colors.dark,
    marginRight: 2,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.dark,
  },
  balanceInfo: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
    textAlign: 'right',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F6',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
  },
  selectedCategory: {
    backgroundColor: Colors.primary,
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.primary,
  },
  selectedCategoryText: {
    color: 'white',
  },
  recentRecipientsContainer: {
    marginBottom: 24,
  },
  recipientsScrollContainer: {
    paddingVertical: 10,
  },
  recipientItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  recipientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  recipientInitials: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  recipientName: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: 2,
  },
  recipientAccount: {
    fontSize: 11,
    color: Colors.gray,
    textAlign: 'center',
  },
  loadingIndicator: {
    marginTop: 10,
  },
  noRecipientsText: {
    fontSize: 14,
    color: Colors.gray,
    fontStyle: 'italic',
    marginTop: 10,
  },
  notesInput: {
    backgroundColor: '#F0F9F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.dark,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    padding: 24,
  },
  transferButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.primaryMuted,
  },
  transferButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
