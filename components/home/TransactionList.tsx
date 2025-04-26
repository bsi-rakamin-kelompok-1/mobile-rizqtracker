import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { formatCurrency } from '@/utils/formatters';
import { FormattedTransaction } from '@/types/cashflow';

interface TransactionListProps {
  transactions: FormattedTransaction[];
  isExpense: boolean;
}

const TransactionList = ({ transactions, isExpense }: TransactionListProps) => {
  if (transactions.length === 0) {
    return null;
  }

  // Helper function to get the icon for transaction type
  const getTransactionIcon = (type: string): string => {
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

  return (
    <View>
      <Text style={styles.transactionTitle}>Transaksi Terakhir</Text>
      <View style={styles.recentTransactionsContainer}>
        {transactions.map((transaction) => (
          <View key={transaction.transaction_id} style={styles.transactionItem}>
            <View style={styles.transactionIconContainer}>
              <Ionicons
                name={getTransactionIcon(transaction.type) as any}
                size={20}
                color={isExpense ? Colors.error : Colors.primary}
                style={styles.transactionIcon}
              />
            </View>
            <View style={styles.transactionDate}>
              <Text style={styles.dateText}>{transaction.date}</Text>
              <Text style={styles.transactionDescription}>
                {transaction.description}
              </Text>
              <Text style={styles.transactionNotes}>{transaction.notes}</Text>
            </View>
            <View style={styles.transactionDetails}>
              <Text
                style={[
                  styles.transactionAmount,
                  isExpense ? styles.expenseAmount : styles.incomeAmount,
                ]}
              >
                {isExpense ? '- ' : '+ '}
                {formatCurrency(transaction.amount)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark,
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
  expenseAmount: {
    color: 'red',
  },
  incomeAmount: {
    color: 'green',
  },
});

export default TransactionList;
