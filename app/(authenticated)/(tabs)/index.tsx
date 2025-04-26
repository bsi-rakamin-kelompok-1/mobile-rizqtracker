import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner-native';
import useAxiosPrivate from '@/hooks/use-axios-private';
import {
  CashflowSummary,
  IncomeDetails,
  ExpenseDetails,
  FormattedTransaction,
  CategoryItem,
} from '@/types/cashflow';
import { formatCurrency, formatPaymentMethod } from '@/utils/formatters';
import Header from '@/components/home/Header';
import BalanceCard from '@/components/BalanceCard';
import CashflowContainer from '@/components/home/CashflowContainer';

export default function AuthenticatedHome() {
  const router = useRouter();
  const navigation = useNavigation();
  const axios = useAxiosPrivate();
  const authStore = useAuthStore();
  const [activeTab, setActiveTab] = useState('pemasukan');
  const [activePeriod, setActivePeriod] = useState('week');
  const [refreshing, setRefreshing] = useState(false);

  const [summaryData, setSummaryData] = useState<CashflowSummary | null>(null);
  const [incomeData, setIncomeData] = useState<IncomeDetails | null>(null);
  const [expenseData, setExpenseData] = useState<ExpenseDetails | null>(null);

  useEffect(() => {
    fetchCashflowData(activePeriod);
  }, [activePeriod]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      StatusBar.setBarStyle('light-content', true);
      StatusBar.setBackgroundColor(Colors.background, true);
    });

    return unsubscribe;
  }, [navigation]);
    

  const fetchCashflowData = async (period: string) => {
    authStore.setIsLoading(true);
    try {
      const [summaryResponse, incomeResponse, expenseResponse] =
        await Promise.all([
          axios.get(`/v1/cashflow?period=${period}`),
          axios.get(`/v1/cashflow/income?period=${period}`),
          axios.get(`/v1/cashflow/expense?period=${period}`),
        ]);

      setSummaryData(summaryResponse.data);
      setIncomeData(incomeResponse.data);
      setExpenseData(expenseResponse.data);

      return { success: true };
    } catch (error) {
      console.error('Error fetching cashflow data:', error);
      toast.error('Failed to load financial data');

      return { success: false, error };
    } finally {
      authStore.setIsLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    fetchCashflowData(activePeriod)
      .then(() => {
        setRefreshing(false);
      })
      .catch(() => {
        setRefreshing(false);
      });
  }, [activePeriod]);

  const handlePeriodChange = (period: string) => {
    setActivePeriod(period);
  };

  // Get appropriate transaction list based on active tab
  const getTransactions = (): FormattedTransaction[] => {
    if (activeTab === 'pemasukan' && incomeData?.income_details) {
      const topupTransactions = incomeData.income_details.topup_data.map(
        (item) => ({
          ...item,
          type: 'topup',
          description: `Topup via ${formatPaymentMethod(item.topup_method)}`,
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
      const expenseDetails = expenseData.expense_details;
      let allExpenses: FormattedTransaction[] = [];

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

  // Calculate financial summary data
  const getTotalIncome = (): number => {
    if (!summaryData?.summary) return 0;
    const { total_topup, total_transfer } = summaryData.summary.income;
    return total_topup + total_transfer;
  };

  const getTotalExpense = (): number => {
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

  const getPercentage = (): number => {
    const totalIncome = getTotalIncome();
    const totalExpense = getTotalExpense();

    // Handle edge cases
    if (totalIncome === 0 && totalExpense === 0) {
      return 0; // No financial activity
    }

    if (totalIncome === 0 && totalExpense > 0) {
      return 100; // Pure deficit
    }

    // For normal cases
    const ratio = totalExpense / totalIncome;

    // Cap the percentage for UI display purposes
    const cappedRatio = Math.min(ratio, 2); // Cap at 200%

    return Math.round(cappedRatio * 100);
  };

  const getSelisih = (): number => {
    return getTotalIncome() - getTotalExpense();
  };

  const getIncomeCategories = (): CategoryItem[] => {
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
        icon: 'arrow-up-circle',
      },
      {
        name: 'Total Transfer',
        amount: summary.total_transfer,
        count: transfer_data.length,
        icon: 'swap-horizontal',
      },
    ];
  };

  // Prepare expense category data with counts
  const getExpenseCategories = (): CategoryItem[] => {
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
        icon: 'basket',
      },
      {
        name: 'Belanja',
        amount: summary.total_shopping,
        count: shopping.length,
        icon: 'cart',
      },
      {
        name: 'Transportasi',
        amount: summary.total_transport,
        count: transport.length,
        icon: 'car',
      },
      {
        name: 'Transfer Kekayaan',
        amount: summary.total_transfer_of_wealth,
        count: transfer_of_wealth.length,
        icon: 'wallet',
      },
      {
        name: 'Tagihan',
        amount: summary.total_bills,
        count: bills.length,
        icon: 'receipt',
      },
    ];
  };

  const handleAvatarPress = () => {
    router.push('/(authenticated)/(tabs)/profile');
  };

  // Prepare all the data for the UI
  const incomeCategories = getIncomeCategories();
  const expenseCategories = getExpenseCategories();
  const transactions = getTransactions();
  const percentage = getPercentage();
  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();
  const selisih = getSelisih();

  if (authStore.isLoading && !authStore.user && !authStore.isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (authStore.user)
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor={Colors.background} />
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
              title='Menyegarkan data...'
              titleColor={Colors.dark}
            />
          }
        >
          <View style={styles.container}>
            {/* Header with greeting and avatar */}
            <Header
              userName={authStore.user.full_name}
              avatarUrl={authStore.user.avatar_url}
              onAvatarPress={handleAvatarPress}
            />

            {/* Balance Card */}
            <BalanceCard
              balance={authStore.user.account.balance}
              accountNumber={authStore.user.account.account_number}
            />

            {/* Cashflow Container with all financial data */}
            <CashflowContainer
              activePeriod={activePeriod}
              handlePeriodChange={handlePeriodChange}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              percentage={percentage}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              selisih={selisih}
              incomeCategories={incomeCategories}
              expenseCategories={expenseCategories}
              transactions={transactions}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );

  return router.replace('./login');
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: 16,
    marginTop: 24,
    backgroundColor: Colors.background,
  },
});
