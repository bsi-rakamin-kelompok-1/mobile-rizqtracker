import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';

type CategoryType = 'income' | 'expense';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

// Define props interface
interface CategoryItemProps {
  name: string;
  amount: number;
  type: CategoryType;
  formatCurrency: (amount: number) => string;
}

// Map category names to icons
const categoryIcons: Record<string, IoniconsName> = {
  // Income categories
  'Total Top Up': 'wallet-outline',
  'Total Transfer': 'arrow-redo-outline',
  
  // Expense categories
  'Kebutuhan': 'basket-outline',
  'Belanja': 'cart-outline',
  'Transportasi': 'car-outline',
  'Transfer Kekayaan': 'gift-outline',
  'Tagihan': 'document-text-outline',
};

export const CategoryItem = ({ name, amount, type, formatCurrency }: CategoryItemProps) => {
  const isIncome = type === 'income';
  const iconColor = isIncome ? '#4CAF50' : '#F44336';
  const iconName = categoryIcons[name] || (isIncome ? 'add-circle-outline' : 'remove-circle-outline');

  return (
    <View style={styles.categoryItem}>
      <View style={styles.categoryNameContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={20} color={iconColor} />
        </View>
        <Text style={styles.categoryName}>{name}</Text>
      </View>
      <Text 
        style={[
          styles.categoryAmount, 
          isIncome ? styles.incomeAmount : styles.expenseAmount
        ]}
      >
        {isIncome ? '+ ' : '- '}{formatCurrency(amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  categoryNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginRight: 12,
  },
  categoryName: {
    color: Colors.dark,
    fontSize: 14,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '500',
  },
  incomeAmount: {
    color: '#4CAF50',
  },
  expenseAmount: {
    color: '#F44336',
  },
});