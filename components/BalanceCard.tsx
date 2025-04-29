// "use client"

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import IslamicPatternSVG from '@/assets/images/IslamicPatternSVG';
import * as Clipboard from 'expo-clipboard';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { formatCurrency } from '@/utils/formatters';
import { useRouter } from 'expo-router';

interface BalanceCardProps {
  balance: number;
  accountNumber: number;
}

const BalanceCard = ({ balance, accountNumber }: BalanceCardProps) => {
  const router = useRouter();
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [isAccountNumberVisible, setIsAccountNumberVisible] = useState(false);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const toggleAccountNumberVisibility = () => {
    setIsAccountNumberVisible(!isAccountNumberVisible);
  };

  const copyToClipboard = () => {
    Clipboard.setStringAsync(accountNumber.toString());

    if (Platform.OS === 'android') {
      ToastAndroid.show(
        'Account number copied to clipboard',
        ToastAndroid.SHORT
      );
    } else {
      Alert.alert('Copied', 'Account number copied to clipboard');
    }
  };

  const navigateToHistory = () => {
    router.push('/(authenticated)/(transaction)/history');
  };

  // Format account number to show only last 4 digits
  const formatAccountNumber = () => {
    if (isAccountNumberVisible) {
      return accountNumber;
    }
    return '••••••••' + accountNumber.toString().slice(-4);
  };

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={[Colors.primaryMuted, Colors.primary, Colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.patternOverlay}>{/* <IslamicPatternSVG /> */}</View>

        <Text style={styles.cardTitle}>Rizqtracker Wallet</Text>

        <View style={styles.balanceContainer}>
          {isBalanceVisible ? (
            <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
          ) : (
            <Text style={styles.balanceAmount}>Rp • • • • • • •</Text>
          )}
          <TouchableOpacity
            onPress={toggleBalanceVisibility}
            style={styles.eyeButton}
          >
            <Feather
              name={isBalanceVisible ? 'eye' : 'eye-off'}
              size={20}
              color='#FFFFFF'
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.accountNumberContainer}>
            <TouchableOpacity
              onPress={toggleAccountNumberVisibility}
              style={styles.accountNumberButton}
            >
              <Text style={styles.accountNumberLabel}>Nomor rekening</Text>
              <Text style={styles.accountNumber}>{formatAccountNumber()}</Text>
            </TouchableOpacity>

            {isAccountNumberVisible && (
              <TouchableOpacity
                onPress={copyToClipboard}
                style={styles.copyButton}
              >
                <Feather name='copy' size={16} color='#FFFFFF' />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={navigateToHistory}
            style={styles.historyButton}
          >
            <Feather
              name='clock'
              size={16}
              color='#FFFFFF'
              style={styles.historyIcon}
            />
            <Text style={styles.historyText}>Riwayat transaksi</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    marginBottom: 16,
    ...defaultStyles.shadow,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.07,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginVertical: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  eyeButton: {
    padding: 5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  accountNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '40%',
  },
  accountNumberButton: {
    flex: 1,
  },
  accountNumberLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  copyButton: {
    padding: 5,
    marginLeft: 8,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  historyIcon: {
    marginRight: 6,
  },
  historyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default BalanceCard;
