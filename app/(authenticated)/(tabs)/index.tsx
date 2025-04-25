import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import * as Clipboard from 'expo-clipboard';
import { toast } from 'sonner-native';
import { DonutChart } from '@/components/DonutChart';
import { defaultStyles } from '@/constants/Styles';

export default function AuthenticatedHome() {
  const router = useRouter();
  const authStore = useAuthStore();
  const [showBalance, setShowBalance] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [activeTab, setActiveTab] = useState('pemasukan');

  // Mock data - replace with actual API calls/state management
  const userData = {
    name: 'User123',
    avatarUrl: 'https://placekitten.com/100/100', // placeholder avatar
    balance: 5000000.0,
    accountNumber: '700000039',
    totalIncome: 5000000.0,
    totalExpense: 3000000.0,
    selisih: 2000000.0,
    percentage: 70,
  };

  const transactions = [
    {
      id: 1,
      date: '20 April 2025',
      type: 'topup',
      description: 'Transfer dari Joe Shakira',
      amount: 4000000.0,
      splitBill: true,
    },
    {
      id: 2,
      date: '20 April 2025',
      type: 'topup',
      description: 'Transfer dari Joe Shakira',
      amount: 4000000.0,
      splitBill: true,
    },
    {
      id: 3,
      date: '20 April 2025',
      type: 'topup',
      description: 'Transfer dari Joe Shakira',
      amount: 4000000.0,
      splitBill: true,
    },
    {
      id: 4,
      date: '20 April 2025',
      type: 'topup',
      description: 'Transfer dari Joe Shakira',
      amount: 4000000.0,
      splitBill: true,
    },
    {
      id: 5,
      date: '20 April 2025',
      type: 'topup',
      description: 'Transfer dari Joe Shakira',
      amount: 4000000.0,
      splitBill: true,
    },
  ];

  const incomeCategories = [
    { name: 'Total Top Up', amount: 5000000.0 },
    { name: 'Total Transfer', amount: 4000000.0 },
  ];

  const expenseCategories = [
    { name: 'Kebutuhan', amount: 2000000.0 },
    { name: 'Belanja', amount: 1000000.0 },
    { name: 'Transportasi', amount: 500000.0 },
    { name: 'Transfer Kekayaan', amount: 300000.0 },
    { name: 'Tagihan', amount: 200000.0 },
  ];

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  const toggleAccountNumber = () => {
    setShowAccountNumber(!showAccountNumber);
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(userData.accountNumber);
    toast.success('Nomor rekening disalin ke clipboard');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle='dark-content' backgroundColor={Colors.background} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Header: Greeting and Avatar */}
          <View style={styles.header}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>
                Assalamu'alaikum, {userData.name}!
              </Text>
              <Text style={styles.subGreeting}>
                Selamat datang di Rizqtracker
              </Text>
            </View>
            <Image
              source={require('@/assets/images/sagiri.jpeg')}
              style={styles.avatar}
            />
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.walletHeader}>Wallet utama</Text>
            <View style={styles.accountNumberContainer}>
              <Text style={styles.accountNumber}>{userData.accountNumber}</Text>
              <TouchableOpacity onPress={copyToClipboard}>
                <Ionicons name='copy-outline' size={20} color='#FFF' />
              </TouchableOpacity>
            </View>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceAmount}>
                {showBalance ? formatCurrency(userData.balance) : 'Rp ••••••••'}
              </Text>
              <TouchableOpacity onPress={toggleBalance}>
                <Ionicons
                  name={showBalance ? 'eye-outline' : 'eye-off-outline'}
                  size={24}
                  color='#FFF'
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Financial Summary with Doughnut Chart */}
          <View style={styles.summaryCard}>
            <View style={styles.chartContainer}>
              <View style={styles.chartWrapper}>
                <DonutChart
                  percentage={userData.percentage}
                  color={'white'}
                  size={100}
                  strokeWidth={12}
                />
                <View style={styles.percentageContainer}>
                  <Text style={styles.percentageText}>
                    {userData.percentage}%
                  </Text>
                  <Text style={styles.percentageLabel}>Pengeluaran</Text>
                </View>
              </View>
            </View>

            <View style={styles.summaryData}>
              <View style={styles.summaryItem}>
                <Ionicons
                  name='podium'
                  size={18}
                  color={Colors.secondary}
                  style={{
                    padding: 4,
                    borderRadius: 8,
                    backgroundColor: 'white',
                  }}
                />

                <View style={{ flex: 1, paddingLeft: 8 }}>
                  <Text style={styles.summaryLabel}>Selisih</Text>
                  <Text style={styles.summaryAmount}>
                    {formatCurrency(userData.selisih)}
                  </Text>
                </View>
              </View>

              <View style={styles.summaryItem}>
                <Ionicons
                  name='arrow-down'
                  size={18}
                  color='red'
                  style={{
                    padding: 4,
                    borderRadius: 8,
                    backgroundColor: 'white',
                  }}
                />
                <View style={{ flex: 1, paddingLeft: 8 }}>
                  <Text style={styles.summaryLabel}>Pengeluaran</Text>
                  <Text style={styles.summaryAmount}>
                    {formatCurrency(userData.totalExpense)}
                  </Text>
                </View>
              </View>

              <View style={styles.summaryItem}>
                <Ionicons
                  name='arrow-up'
                  size={18}
                  color='green'
                  style={{
                    padding: 4,
                    borderRadius: 8,
                    backgroundColor: 'white',
                  }}
                />
                <View style={{ flex: 1, paddingLeft: 8 }}>
                  <Text style={styles.summaryLabel}>Pemasukan</Text>
                  <Text style={styles.summaryAmount}>
                    {formatCurrency(userData.totalIncome)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Transactions Section */}
          <View style={styles.transactionsCard}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === 'pemasukan' && styles.activeTab,
                ]}
                onPress={() => setActiveTab('pemasukan')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'pemasukan' && styles.activeTabText,
                  ]}
                >
                  Pemasukan 
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === 'pengeluaran' && styles.activeTab,
                ]}
                onPress={() => setActiveTab('pengeluaran')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'pengeluaran' && styles.activeTabText,
                  ]}
                >
                  Pengeluaran
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab Content */}
            {activeTab === 'pemasukan' ? (
              <View style={styles.tabContent}>
                {incomeCategories.map((item, index) => (
                  <View key={index} style={styles.categoryItem}>
                    <Text style={styles.categoryName}>{item.name}</Text>
                    <Text style={styles.categoryAmount}>
                      + {formatCurrency(item.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.tabContent}>
                {expenseCategories.map((item, index) => (
                  <View key={index} style={styles.categoryItem}>
                    <Text style={styles.categoryName}>{item.name}</Text>
                    <Text style={[styles.categoryAmount, styles.expenseAmount]}>
                      - {formatCurrency(item.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Recent Transactions */}
            <View style={styles.recentTransactionsContainer}>
              {transactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={styles.transactionDate}>
                    <Text style={styles.dateText}>{transaction.date}</Text>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionType}>
                      {transaction.type}
                    </Text>
                  </View>
                  <View style={styles.transactionDetails}>
                    {transaction.splitBill && (
                      <Text style={styles.splitBillTag}>Split Bill</Text>
                    )}
                    <Text style={styles.transactionAmount}>
                      + {formatCurrency(transaction.amount)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// For the DonutChart component, create it in components/DonutChart.tsx
// Below is the style for the main component

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    marginTop: 24,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 8,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  subGreeting: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    ...defaultStyles.shadow,
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    gap: 8,
    ...defaultStyles.shadow,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  walletHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 0.5,
  },  
  accountNumberContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  accountNumber: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 1,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 12,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  quickActionContainer: {
    marginTop: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quickActionButton: {
    alignItems: 'center',
    minWidth: 60,
  },
  quickActionIcon: {
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  quickActionText: {
    color: '#FFF',
    fontSize: 12,
  },
  summaryCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCategories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  categoryTag: {
    color: '#FFF',
    fontSize: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  percentageContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  percentageLabel: {
    color: '#FFF',
    fontSize: 10,
  },
  summaryData: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  summaryLabel: {
    color: '#FFF',
    fontSize: 14,
    flex: 1,
    justifyContent: 'flex-start',
  },
  summaryAmount: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  transactionsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.dark,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFF',
  },
  tabContent: {
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  categoryName: {
    color: Colors.dark,
    fontSize: 14,
  },
  categoryAmount: {
    color: 'green',
    fontSize: 14,
    fontWeight: '500',
  },
  expenseAmount: {
    color: 'red',
  },
  recentTransactionsContainer: {
    marginTop: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  transactionDate: {
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    color: Colors.dark,
    marginBottom: 2,
  },
  transactionType: {
    fontSize: 12,
    color: Colors.primary,
  },
  transactionDetails: {
    alignItems: 'flex-end',
  },
  splitBillTag: {
    fontSize: 12,
    color: Colors.primary,
    backgroundColor: 'rgba(0,184,148,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 4,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: 'green',
  },
});
