import React, { useState, useEffect } from 'react';
import { useAdaptiveToast } from '@/utils/toast';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { useKeyboardVisibility } from '@/hooks/useKeyboardVisibility';

// Payment method type
type PaymentMethod = 'debit_card' | 'credit_card' | 'bank_transfer';

interface PaymentOption {
  id: PaymentMethod;
  label: string;
  icon: React.ReactNode;
}

const Topup = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isKeyboardVisible = useKeyboardVisibility();
  const toast = useAdaptiveToast();
  const [error, setError] = useState<string | null>(null);
  const MINIMUM_AMOUNT = 10000;

  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const paymentOptions: PaymentOption[] = [
    {
      id: 'debit_card',
      label: 'Kartu Debit',
      icon: <Ionicons name='card-outline' size={24} color={Colors.primary} />,
    },
    {
      id: 'credit_card',
      label: 'Kartu Kredit',
      icon: <Ionicons name='card' size={24} color={Colors.primary} />,
    },
    {
      id: 'bank_transfer',
      label: 'Bank Transfer',
      icon: <Ionicons name='cash-outline' size={24} color={Colors.primary} />,
    },
  ];

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setError(null);

    if (numericValue) {
      const numericAmount = parseInt(numericValue, 10);
      const formatted = new Intl.NumberFormat('id-ID').format(numericAmount);
      setAmount(formatted);
    } else {
      setAmount('');
    }
  };

  const validateAmount = () => {
    const numericAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);

    if (numericAmount < MINIMUM_AMOUNT) {
      setError(`Minimum top up Rp ${MINIMUM_AMOUNT.toLocaleString('id-ID')}`);
      return false;
    }

    return true;
  };

  const handleTopUp = () => {
    if (!amount || !selectedMethod) {
      return;
    }

    // Validate minimum amount
    if (!validateAmount()) {
      toast.error('Nominal tidak valid', {
        description: `Minimum top up Rp ${MINIMUM_AMOUNT.toLocaleString(
          'id-ID'
        )}`,
        duration: 2000,
      });
      return;
    }

    // Navigate to PIN verification page, passing the necessary data
    router.push({
      pathname: '/(authenticated)/(transaction)/transaction-pin',
      params: {
        transaction_type: 'topup',
        amount: amount.replace(/[^0-9]/g, ''),
        method: selectedMethod,
        notes: notes,
      },
    });
  };

  // Calculate if the button should be disabled
  const isSubmitDisabled = () => {
    if (!amount || !selectedMethod) return true;

    const numericAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    return numericAmount < MINIMUM_AMOUNT;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectPaymentMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setIsDropdownOpen(false);
  };

  const selectedOption = paymentOptions.find(
    (option) => option.id === selectedMethod
  );

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
            <Text style={styles.headerTitle}>Top Up</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            style={styles.content}
            keyboardShouldPersistTaps='handled'
          >
            <View style={styles.formContainer}>
              {/* Amount Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nominal Top Up</Text>
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
                {error && <Text style={styles.errorText}>{error}</Text>}
                <Text style={styles.helperText}>Minimum Rp 10.000</Text>
              </View>

              {/* Payment Method Dropdown */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sumber Dana</Text>

                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={toggleDropdown}
                >
                  {selectedOption ? (
                    <View style={styles.selectedMethodContainer}>
                      <View style={styles.iconContainer}>
                        {selectedOption.icon}
                      </View>
                      <Text style={styles.selectedMethodText}>
                        {selectedOption.label}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.placeholderText}>
                      Pilih metode pembayaran
                    </Text>
                  )}
                  <Ionicons
                    name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={Colors.dark}
                  />
                </TouchableOpacity>

                {isDropdownOpen && (
                  <View style={styles.dropdownMenu}>
                    {paymentOptions.map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        style={styles.dropdownItem}
                        onPress={() => selectPaymentMethod(option.id)}
                      >
                        <View style={styles.iconContainer}>{option.icon}</View>
                        <Text style={styles.dropdownItemText}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Notes Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Catatan (opsional)</Text>
                <TextInput
                  style={styles.notesInput}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder='Masukkan catatan top up'
                  placeholderTextColor='#AAAAAA'
                  multiline
                />
              </View>
            </View>

            {!isKeyboardVisible && (
              <View style={styles.buttonContainer}>
                <Button
                  style={[
                    styles.topupButton,
                    isSubmitDisabled() ? styles.disabledButton : {},
                  ]}
                  onPress={handleTopUp}
                  disabled={isSubmitDisabled()}
                >
                  <Text style={styles.topupButtonText}>Lanjut</Text>
                </Button>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

// Add these new styles
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
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.dark,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F9F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  selectedMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6F7F2',
    borderRadius: 8,
    marginRight: 12,
  },
  selectedMethodText: {
    fontSize: 16,
    color: Colors.dark,
  },
  placeholderText: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  dropdownMenu: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 4,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
  },
  dropdownItemText: {
    fontSize: 16,
    color: Colors.dark,
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
  topupButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.primaryMuted,
  },
  topupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 2,
  },
  helperText: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 6,
    marginLeft: 2,
  },
});

export default Topup;
