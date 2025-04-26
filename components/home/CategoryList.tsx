import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { formatCurrency } from '@/utils/formatters';
import { CategoryItem } from '@/types/cashflow';

interface CategoryListProps {
  categories: CategoryItem[];
  isExpense: boolean;
}

const CategoryList = ({ categories, isExpense }: CategoryListProps) => {
  if (categories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Tidak ada data {isExpense ? 'pengeluaran' : 'pemasukan'} untuk periode ini
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {categories.map((item, index) => (
        <View key={index} style={styles.categoryItem}>
          <View style={styles.categoryLeft}>
            <Ionicons
              name={item.icon as any}
              size={20}
              color={isExpense ? Colors.error : Colors.primary}
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
            style={[
              styles.categoryAmount,
              isExpense ? styles.expenseAmount : styles.incomeAmount,
            ]}
          >
            {formatCurrency(item.amount)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.gray,
    fontSize: 14,
  },
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
    fontSize: 14,
    fontWeight: '500',
  },
  incomeAmount: {
    color: 'green',
  },
  expenseAmount: {
    color: 'red',
  },
});

export default CategoryList;