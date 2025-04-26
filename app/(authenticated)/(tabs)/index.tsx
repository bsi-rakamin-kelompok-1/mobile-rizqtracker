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
import { CategoryItem } from '@/components/CategoryItem';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BalanceCard from '@/components/BalanceCard';

// Mock API responses - replace with actual API calls
const mockIncomeResponse = {
  success: true,
  message: 'Cashflow income retrieved successfully',
  period: {
    start: '2025-04-01T00:00:00.776813719',
    end: '2025-04-25T07:53:51.776813719',
  },
  income_details: {
    topup_data: [
      {
        transaction_id: '3dde9eac-799a-49fd-9731-c2ede5ee63b6',
        topup_method: 'debit_card',
        amount: 20000,
        notes: 'ini coba topup',
        created_at: '2025-04-25T07:53:30.77247',
      },
    ],
    transfer_data: [
      {
        transaction_id: '5e0cbe6a-5e20-4174-bff3-5e224cbefab2',
        transaction_category: 'shopping',
        sender_full_name: 'Jane Doe',
        sender_account_number: 700000000,
        amount: 1000,
        notes: 'ini notes coba',
        created_at: '2025-04-25T07:52:34.376673',
      },
      {
        transaction_id: 'cd1d5890-0164-4920-93f8-524072d53334',
        transaction_category: 'shopping',
        sender_full_name: 'Jane Doe',
        sender_account_number: 700000000,
        amount: 1000,
        notes: 'ini notes coba',
        created_at: '2025-04-25T07:52:35.16444',
      },
      {
        transaction_id: '8dabd638-0b0d-445f-88c9-49f37ccfb01b',
        transaction_category: 'shopping',
        sender_full_name: 'Jane Doe',
        sender_account_number: 700000000,
        amount: 1000,
        notes: 'ini notes coba',
        created_at: '2025-04-25T07:52:36.039426',
      },
      {
        transaction_id: '85e921de-75fe-4cb6-84d2-4072c7beaa31',
        transaction_category: 'needs',
        sender_full_name: 'Jane Doe',
        sender_account_number: 700000000,
        amount: 1000,
        notes: 'ini notes coba',
        created_at: '2025-04-25T07:52:40.642391',
      },
      {
        transaction_id: 'b1f60b50-4a92-4c79-930f-987d3b4cd321',
        transaction_category: 'bills',
        sender_full_name: 'Jane Doe',
        sender_account_number: 700000000,
        amount: 1000,
        notes: 'ini notes coba',
        created_at: '2025-04-25T07:52:43.875042',
      },
      {
        transaction_id: '9c0f4f20-d736-4326-bfa4-bae9ee9c95af',
        transaction_category: 'transport',
        sender_full_name: 'Jane Doe',
        sender_account_number: 700000000,
        amount: 1000,
        notes: 'ini notes coba',
        created_at: '2025-04-25T07:52:47.693108',
      },
    ],
  },
};

const mockExpenseResponse = {
  success: true,
  message: 'Cashflow expense retrieved successfully',
  period: {
    start: '2025-04-14T00:00:00.97290467',
    end: '2025-04-20T23:26:53.97290467',
  },
  expense_details: {
    needs: [
      {
        transaction_id: '791c4f28-2ce6-46a4-b76b-e6ec0092b0b9',
        recipient_full_name: 'John Doe',
        recipient_account_number: 700000000,
        amount: 1000,
        notes: 'ini notes coba',
        created_at: '2025-04-20T23:23:41.88459',
      },
    ],
    bills: [
      {
        transaction_id: '89060f8e-5b2e-4709-a47b-11e7d60d0e63',
        recipient_full_name: 'John Doe',
        recipient_account_number: 700000000,
        amount: 1000,
        notes: 'ini notes coba',
        created_at: '2025-04-20T23:23:46.577262',
      },
    ],
    shopping: [
      {
        transaction_id: 'e7845501-7afd-455f-99ae-5404133dd66c',
        recipient_full_name: 'John Doe',
        recipient_account_number: 700000000,
        amount: 1000,
        notes: 'ini notes coba',
        created_at: '2025-04-20T23:23:54.355914',
      },
    ],
    transport: [
      {
        transaction_id: 'd3c76d18-655e-40f1-b9c2-b3686a3c3499',
        recipient_full_name: 'John Doe',
        recipient_account_number: 700000000,
        amount: 1000,
        notes: 'ini notes coba',
        created_at: '2025-04-20T23:23:50.382512',
      },
    ],
    transfer_of_wealth: [],
  },
};

export default function AuthenticatedHome() {
  const router = useRouter();
  const authStore = useAuthStore();
  const [showBalance, setShowBalance] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [activeTab, setActiveTab] = useState('pemasukan');
  const [activePeriod, setActivePeriod] = useState('minggu');
  const [incomeData, setIncomeData] = useState(mockIncomeResponse);
  const [expenseData, setExpenseData] = useState(mockExpenseResponse);

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

  // Calculate income categories from API response
  const calculateIncomeCategories = () => {
    if (!incomeData?.income_details) return [];

    const { topup_data = [], transfer_data = [] } = incomeData.income_details;

    const topupAmount = topup_data.reduce(
      (total, item) => total + item.amount,
      0
    );

    const transferAmount = transfer_data.reduce(
      (total, item) => total + item.amount,
      0
    );

    return [
      { name: 'Total Top Up', amount: topupAmount, icon: 'arrow-up-circle' },
      {
        name: 'Total Transfer',
        amount: transferAmount,
        icon: 'swap-horizontal',
      },
    ];
  };

  // Calculate expense categories from API response
  const calculateExpenseCategories = () => {
    if (!expenseData?.expense_details) return [];

    const {
      needs = [],
      shopping = [],
      transport = [],
      bills = [],
      transfer_of_wealth = [],
    } = expenseData.expense_details;

    return [
      {
        name: 'Kebutuhan',
        amount: needs.reduce((total, item) => total + item.amount, 0),
        icon: 'basket',
      },
      {
        name: 'Belanja',
        amount: shopping.reduce((total, item) => total + item.amount, 0),
        icon: 'cart',
      },
      {
        name: 'Transportasi',
        amount: transport.reduce((total, item) => total + item.amount, 0),
        icon: 'car',
      },
      {
        name: 'Transfer Kekayaan',
        amount: transfer_of_wealth.reduce(
          (total, item) => total + item.amount,
          0
        ),
        icon: 'wallet',
      },
      {
        name: 'Tagihan',
        amount: bills.reduce((total, item) => total + item.amount, 0),
        icon: 'receipt',
      },
    ].filter((item) => item.amount > 0); // Only show categories with transactions
  };

  // Handle period change
  const handlePeriodChange = (period: any) => {
    setActivePeriod(period);
    // In a real app, you would fetch data for the selected period
    // fetchIncomeData(period);
    // fetchExpenseData(period);
  };

  // Get appropriate transaction list based on active tab
  const getTransactions = () => {
    if (activeTab === 'pemasukan') {
      const topupTransactions =
        incomeData?.income_details?.topup_data?.map((item) => ({
          ...item,
          type: 'topup',
          description: `Topup via ${item.topup_method}`,
          date: new Date(item.created_at).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        })) || [];

      const transferTransactions =
        incomeData?.income_details?.transfer_data?.map((item) => ({
          ...item,
          type: 'transfer',
          description: `Transfer dari ${item.sender_full_name}`,
          date: new Date(item.created_at).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        })) || [];

      return [...topupTransactions, ...transferTransactions].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else {
      // Handle expense transactions
      const expenseDetails = expenseData?.expense_details || {};
      let allExpenses = [] as any[];

      Object.entries(expenseDetails).forEach(([category, transactions]) => {
        if (Array.isArray(transactions)) {
          const formattedTransactions = transactions.map((item) => ({
            ...item,
            type: category,
            description: `Transfer ke ${item.recipient_full_name}`,
            date: new Date(item.created_at).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          }));
          allExpenses = [...allExpenses, ...formattedTransactions];
        }
      });

      return allExpenses.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  };

  // Get icon for transaction type
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'topup':
        return 'arrow-up-circle';
      case 'transfer':
        return 'swap-horizontal';
      case 'needs':
        return 'basket';
      case 'shopping':
        return 'cart';
      case 'transport':
        return 'car';
      case 'bills':
        return 'receipt';
      case 'transfer_of_wealth':
        return 'wallet';
      default:
        return 'cash';
    }
  };

  const incomeCategories = calculateIncomeCategories();
  const expenseCategories = calculateExpenseCategories();
  const transactions = getTransactions();

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
                Berikut adalah catatan finansialmu.
              </Text>
            </View>
            <Image
              source={require('@/assets/images/sagiri.jpeg')}
              style={styles.avatar}
            />
          </View>

          {/* Balance Card */}
          <BalanceCard
            balance={userData.balance}
            accountNumber={userData.accountNumber}
          />

          {/* Cashflow Parent Card */}
          <View style={styles.cashflowContainer}>
            {/* 1. Title for the parent card */}
            <Text style={styles.sectionTitle}>Ringkasan Finansial</Text>

            {/* 2. Period tabs */}
            <View style={styles.periodTabContainer}>
              <TouchableOpacity
                style={[
                  styles.periodTab,
                  activePeriod === 'minggu' && styles.activePeriodTab,
                ]}
                onPress={() => handlePeriodChange('minggu')}
              >
                <Text
                  style={[
                    styles.periodTabText,
                    activePeriod === 'minggu' && styles.activePeriodTabText,
                  ]}
                >
                  Minggu ini
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.periodTab,
                  activePeriod === 'bulan' && styles.activePeriodTab,
                ]}
                onPress={() => handlePeriodChange('bulan')}
              >
                <Text
                  style={[
                    styles.periodTabText,
                    activePeriod === 'bulan' && styles.activePeriodTabText,
                  ]}
                >
                  Bulan ini
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.periodTab,
                  activePeriod === '3bulan' && styles.activePeriodTab,
                ]}
                onPress={() => handlePeriodChange('3bulan')}
              >
                <Text
                  style={[
                    styles.periodTabText,
                    activePeriod === '3bulan' && styles.activePeriodTabText,
                  ]}
                >
                  Tiga bulan
                </Text>
              </TouchableOpacity>
            </View>

            {/* 3. Cashflow Summary with Donut Chart */}
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

            {/* 4. Cashflow Transactions */}
            <View style={styles.transactionsSection}>
              {/* Tab Selection */}
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

              {/* Category Summary */}
              <View style={styles.tabContent}>
                {activeTab === 'pemasukan'
                  ? incomeCategories.map((item, index) => (
                      <View key={index} style={styles.categoryItem}>
                        <View style={styles.categoryLeft}>
                          <Ionicons
                            name={item.icon}
                            size={20}
                            color={Colors.primary}
                            style={styles.categoryIcon}
                          />
                          <Text style={styles.categoryName}>{item.name}</Text>
                        </View>
                        <Text style={styles.categoryAmount}>
                          {formatCurrency(item.amount)}
                        </Text>
                      </View>
                    ))
                  : expenseCategories.map((item, index) => (
                      <View key={index} style={styles.categoryItem}>
                        <View style={styles.categoryLeft}>
                          <Ionicons
                            name={item.icon}
                            size={20}
                            color={Colors.error}
                            style={styles.categoryIcon}
                          />
                          <Text style={styles.categoryName}>{item.name}</Text>
                        </View>
                        <Text
                          style={[styles.categoryAmount, styles.expenseAmount]}
                        >
                          {formatCurrency(item.amount)}
                        </Text>
                      </View>
                    ))}
              </View>

              {/* Recent Transactions */}
              {transactions.length > 0 && (
                <View>
                  <Text style={styles.transactionTitle}>
                    Transaksi Terakhir
                  </Text>
                  <View style={styles.recentTransactionsContainer}>
                    {transactions.map((transaction) => (
                      <View
                        key={transaction.transaction_id}
                        style={styles.transactionItem}
                      >
                        <View style={styles.transactionIconContainer}>
                          <Ionicons
                            name={getTransactionIcon(transaction.type)}
                            size={20}
                            color={
                              activeTab === 'pemasukan'
                                ? Colors.primary
                                : Colors.error
                            }
                            style={styles.transactionIcon}
                          />
                        </View>
                        <View style={styles.transactionDate}>
                          <Text style={styles.dateText}>
                            {transaction.date}
                          </Text>
                          <Text style={styles.transactionDescription}>
                            {transaction.description}
                          </Text>
                          <Text style={styles.transactionNotes}>
                            {transaction.notes}
                          </Text>
                        </View>
                        <View style={styles.transactionDetails}>
                          <Text
                            style={[
                              styles.transactionAmount,
                              activeTab === 'pengeluaran'
                                ? styles.expenseAmount
                                : styles.incomeAmount,
                            ]}
                          >
                            {activeTab === 'pengeluaran' ? '- ' : '+ '}
                            {formatCurrency(transaction.amount)}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  // Cashflow Parent Card
  cashflowContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    ...defaultStyles.shadow,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 16,
  },
  // Period tabs
  periodTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 4,
  },
  periodTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  activePeriodTab: {
    backgroundColor: Colors.primary,
  },
  periodTabText: {
    fontSize: 12,
    color: Colors.dark,
    fontWeight: '500',
  },
  activePeriodTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Cashflow Summary
  summaryCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    ...defaultStyles.shadow,
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  // Transactions
  transactionsSection: {
    marginTop: 8,
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
  // Category Item
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    padding: 8,
    marginRight: 12,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  categoryName: {
    color: Colors.dark,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryAmount: {
    color: 'green',
    fontSize: 14,
    fontWeight: '500',
  },
  expenseAmount: {
    color: 'red',
  },
  incomeAmount: {
    color: 'green',
  },
  // Transactions
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark,
    marginTop: 12,
    marginBottom: 8,
  },
  recentTransactionsContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  transactionItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  transactionIconContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  transactionIcon: {
    padding: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
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
  transactionNotes: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  transactionDetails: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 90,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '500',
  },
});
