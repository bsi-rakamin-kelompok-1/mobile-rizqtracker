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
import BalanceCard from '@/components/BalanceCard';
import useAxiosPrivate from '@/hooks/use-axios-private';

// Define API response types
interface PeriodRange {
  start: string;
  end: string;
}

interface CashflowSummary {
  success: boolean;
  message: string;
  period: PeriodRange;
  summary: {
    income: {
      total_topup: number;
      total_transfer: number;
    };
    expense: {
      total_needs: number;
      total_bills: number;
      total_shopping: number;
      total_transport: number;
      total_transfer_of_wealth: number;
    };
  };
}

interface IncomeDetails {
  success: boolean;
  message: string;
  period: PeriodRange;
  income_details: {
    topup_data: Array<{
      transaction_id: string;
      topup_method: string;
      amount: number;
      notes: string;
      created_at: string;
    }>;
    transfer_data: Array<{
      transaction_id: string;
      transaction_category: string;
      sender_full_name: string;
      sender_account_number: number;
      amount: number;
      notes: string;
      created_at: string;
    }>;
  };
}

interface ExpenseDetails {
  success: boolean;
  message: string;
  period: PeriodRange;
  expense_details: {
    needs: Array<{
      transaction_id: string;
      recipient_full_name: string;
      recipient_account_number: number;
      amount: number;
      notes: string;
      created_at: string;
    }>;
    bills: Array<{
      transaction_id: string;
      recipient_full_name: string;
      recipient_account_number: number;
      amount: number;
      notes: string;
      created_at: string;
    }>;
    shopping: Array<{
      transaction_id: string;
      recipient_full_name: string;
      recipient_account_number: number;
      amount: number;
      notes: string;
      created_at: string;
    }>;
    transport: Array<{
      transaction_id: string;
      recipient_full_name: string;
      recipient_account_number: number;
      amount: number;
      notes: string;
      created_at: string;
    }>;
    transfer_of_wealth: Array<{
      transaction_id: string;
      recipient_full_name: string;
      recipient_account_number: number;
      amount: number;
      notes: string;
      created_at: string;
    }>;
  };
}

// Mock API responses for initial rendering
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
    shopping: [],
    transport: [],
    transfer_of_wealth: [],
  },
};

const mockSummaryResponse = {
  success: true,
  message: 'Cashflow summary retrieved successfully',
  period: {
    start: '2025-04-01T00:00:00.479356395',
    end: '2025-04-20T23:27:54.479356395',
  },
  summary: {
    income: {
      total_topup: 60000,
      total_transfer: 1000,
    },
    expense: {
      total_needs: 0,
      total_bills: 1000,
      total_shopping: 1000,
      total_transport: 1000,
      total_transfer_of_wealth: 1000,
    },
  },
};

// Base URL for API calls

export default function AuthenticatedHome() {
  const router = useRouter();
  const axios = useAxiosPrivate();
  const authStore = useAuthStore();
  const [showBalance, setShowBalance] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [activeTab, setActiveTab] = useState('pemasukan');
  const [activePeriod, setActivePeriod] = useState('week');

  // API response data states
  const [summaryData, setSummaryData] = useState<CashflowSummary | null>(
    mockSummaryResponse as CashflowSummary
  );
  const [incomeData, setIncomeData] = useState<IncomeDetails | null>(
    mockIncomeResponse as IncomeDetails
  );
  const [expenseData, setExpenseData] = useState<ExpenseDetails | null>(
    mockExpenseResponse as ExpenseDetails
  );
  const [loading, setLoading] = useState<boolean>(false);

  // Mock user data - replace with actual user data
  const userData = {
    name: 'User123',
    avatarUrl: 'https://i.pravatar.cc/300',
    balance: 5000000.0,
    accountNumber: '700000039',
  };

  // Fetch all data when period changes
  useEffect(() => {
    fetchCashflowData(activePeriod);
  }, [activePeriod]);

  // Fetch data based on period
  const fetchCashflowData = async (period: string) => {
    setLoading(true);
    try {
      // Fetch all three endpoints in parallel
      const [summaryResponse, incomeResponse, expenseResponse] =
        await Promise.all([
          axios.get(`/v1/cashflow?period=${period}`),
          axios.get(`/v1/cashflow/income?period=${period}`),
          axios.get(`/v1/cashflow/expense?period=${period}`),
        ]);

      // Set state with response data
      setSummaryData(summaryResponse.data);
      setIncomeData(incomeResponse.data);
      setExpenseData(expenseResponse.data);
    } catch (error) {
      console.error('Error fetching cashflow data:', error);
      toast.error('Failed to load financial data');

      // Use mock data as fallback
      setSummaryData(mockSummaryResponse as CashflowSummary);
      setIncomeData(mockIncomeResponse as IncomeDetails);
      setExpenseData(mockExpenseResponse as ExpenseDetails);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  // Handle period change
  const handlePeriodChange = (period: string) => {
    setActivePeriod(period);
    // API will be fetched by the useEffect
  };

  // Get appropriate transaction list based on active tab
  const getTransactions = () => {
    if (activeTab === 'pemasukan' && incomeData?.income_details) {
      const topupTransactions = incomeData.income_details.topup_data.map(
        (item) => ({
          ...item,
          type: 'topup',
          description: `Topup via ${item.topup_method}`,
          date: new Date(item.created_at).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        })
      );

      const transferTransactions = incomeData.income_details.transfer_data.map(
        (item) => ({
          ...item,
          type: 'transfer',
          description: `Transfer dari ${item.sender_full_name}`,
          date: new Date(item.created_at).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        })
      );

      return [...topupTransactions, ...transferTransactions].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (expenseData?.expense_details) {
      // Handle expense transactions
      const expenseDetails = expenseData.expense_details;
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

    return [];
  };

  // Get icon for transaction type
  const getTransactionIcon = (type: string): keyof typeof Ionicons.glyphMap => {
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

  // Calculate financial summary data
  const getTotalIncome = () => {
    if (!summaryData?.summary) return 0;
    const { total_topup, total_transfer } = summaryData.summary.income;
    return total_topup + total_transfer;
  };

  const getTotalExpense = () => {
    if (!summaryData?.summary) return 0;
    const {
      total_needs,
      total_bills,
      total_shopping,
      total_transport,
      total_transfer_of_wealth,
    } = summaryData.summary.expense;

    return (
      total_needs +
      total_bills +
      total_shopping +
      total_transport +
      total_transfer_of_wealth
    );
  };

  const getPercentage = () => {
    const totalIncome = getTotalIncome();
    const totalExpense = getTotalExpense();
    if (totalIncome === 0) return 0;
    return Math.round((totalExpense / totalIncome) * 100);
  };

  const getSelisih = () => {
    return getTotalIncome() - getTotalExpense();
  };

  const getIncomeCategories = () => {
    if (!incomeData?.income_details) return [];

    const { topup_data = [], transfer_data = [] } = incomeData.income_details;
    const summary = summaryData?.summary?.income || {
      total_topup: 0,
      total_transfer: 0,
    };

    return [
      {
        name: 'Total Top Up',
        amount: summary.total_topup,
        count: topup_data.length,
        icon: 'arrow-up-circle' as keyof typeof Ionicons.glyphMap,
      },
      {
        name: 'Total Transfer',
        amount: summary.total_transfer,
        count: transfer_data.length,
        icon: 'swap-horizontal' as keyof typeof Ionicons.glyphMap,
      },
    ];
  };

  // Prepare expense category data with counts
  const getExpenseCategories = () => {
    if (!expenseData?.expense_details) return [];

    const {
      needs = [],
      shopping = [],
      transport = [],
      bills = [],
      transfer_of_wealth = [],
    } = expenseData.expense_details;

    const summary = summaryData?.summary?.expense || {
      total_needs: 0,
      total_shopping: 0,
      total_transport: 0,
      total_bills: 0,
      total_transfer_of_wealth: 0,
    };

    return [
      {
        name: 'Kebutuhan',
        amount: summary.total_needs,
        count: needs.length,
        icon: 'basket' as keyof typeof Ionicons.glyphMap,
      },
      {
        name: 'Belanja',
        amount: summary.total_shopping,
        count: shopping.length,
        icon: 'cart' as keyof typeof Ionicons.glyphMap,
      },
      {
        name: 'Transportasi',
        amount: summary.total_transport,
        count: transport.length,
        icon: 'car' as keyof typeof Ionicons.glyphMap,
      },
      {
        name: 'Transfer Kekayaan',
        amount: summary.total_transfer_of_wealth,
        count: transfer_of_wealth.length,
        icon: 'wallet' as keyof typeof Ionicons.glyphMap,
      },
      {
        name: 'Tagihan',
        amount: summary.total_bills,
        count: bills.length,
        icon: 'receipt' as keyof typeof Ionicons.glyphMap,
      },
    ].filter((item) => item.amount > 0); // Only show categories with transactions
  };

  const incomeCategories = getIncomeCategories();
  const expenseCategories = getExpenseCategories();
  const transactions = getTransactions();
  const percentage = getPercentage();
  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();
  const selisih = getSelisih();

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
              source={
                userData.avatarUrl
                  ? { uri: userData.avatarUrl }
                  : require('@/assets/images/sagiri.jpeg')
              }
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
            <Text style={styles.sectionTitle}>Ringkasan Cashflow</Text>

            {/* 2. Period tabs */}
            <View style={styles.periodTabContainer}>
              <TouchableOpacity
                style={[
                  styles.periodTab,
                  activePeriod === 'week' && styles.activePeriodTab,
                ]}
                onPress={() => handlePeriodChange('week')}
              >
                <Text
                  style={[
                    styles.periodTabText,
                    activePeriod === 'week' && styles.activePeriodTabText,
                  ]}
                >
                  Minggu ini
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.periodTab,
                  activePeriod === 'month' && styles.activePeriodTab,
                ]}
                onPress={() => handlePeriodChange('month')}
              >
                <Text
                  style={[
                    styles.periodTabText,
                    activePeriod === 'month' && styles.activePeriodTabText,
                  ]}
                >
                  Bulan ini
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.periodTab,
                  activePeriod === 'three_months' && styles.activePeriodTab,
                ]}
                onPress={() => handlePeriodChange('three_months')}
              >
                <Text
                  style={[
                    styles.periodTabText,
                    activePeriod === 'three_months' &&
                      styles.activePeriodTabText,
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
                    percentage={percentage}
                    color={'white'}
                    size={100}
                    strokeWidth={12}
                  />
                  <View style={styles.percentageContainer}>
                    <Text style={styles.percentageText}>{percentage}%</Text>
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
                      {formatCurrency(selisih)}
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
                      {formatCurrency(totalExpense)}
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
                      {formatCurrency(totalIncome)}
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
                          <View>
                            <Text style={styles.categoryName}>{item.name}</Text>
                            <Text style={styles.transactionCount}>
                              {item.count} transaksi
                            </Text>
                          </View>
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
                          <View>
                            <Text style={styles.categoryName}>{item.name}</Text>
                            <Text style={styles.transactionCount}>
                              {item.count} transaksi
                            </Text>
                          </View>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  transactionCount: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
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
