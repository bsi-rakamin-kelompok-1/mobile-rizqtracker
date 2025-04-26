import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import PeriodTabs from './PeriodTabs';
import SummaryChart from './SummaryChart';
import CashflowTabs from './CashflowTabs';
import CategoryList from './CategoryList';
import TransactionList from './TransactionList';
import { CategoryItem, FormattedTransaction } from '@/types/cashflow';

interface CashflowContainerProps {
  activePeriod: string;
  handlePeriodChange: (period: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  percentage: number;
  totalIncome: number;
  totalExpense: number;
  selisih: number;
  incomeCategories: CategoryItem[];
  expenseCategories: CategoryItem[];
  transactions: FormattedTransaction[];
}

const CashflowContainer = ({
  activePeriod,
  handlePeriodChange,
  activeTab,
  setActiveTab,
  percentage,
  totalIncome,
  totalExpense,
  selisih,
  incomeCategories,
  expenseCategories,
  transactions,
}: CashflowContainerProps) => {
  const handleTabChange = (tab: string) => {
    // Make sure to preserve the status bar color
    StatusBar.setBackgroundColor(Colors.background);
    StatusBar.setBarStyle('light-content');

    // Then call the original setter
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      {/* Title for the parent card */}
      <Text style={styles.sectionTitle}>Ringkasan Cashflow</Text>

      {/* Period tabs */}
      <PeriodTabs
        activePeriod={activePeriod}
        handlePeriodChange={handlePeriodChange}
      />

      {/* Summary Chart */}
      <SummaryChart
        percentage={percentage}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        selisih={selisih}
      />

      {/* Cashflow Tabs */}
      <View>
        <CashflowTabs
          activeTab={activeTab}
          setActiveTab={handleTabChange} // Use the new handler
        />

        {/* Category List */}
        <CategoryList
          categories={
            activeTab === 'pemasukan' ? incomeCategories : expenseCategories
          }
          isExpense={activeTab === 'pengeluaran'}
        />

        {/* Transaction List */}
        <TransactionList
          transactions={transactions}
          isExpense={activeTab === 'pengeluaran'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default CashflowContainer;
