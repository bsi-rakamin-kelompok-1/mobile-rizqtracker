import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DonutChart } from '@/components/DonutChart';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { formatCurrency } from '@/utils/formatters';

interface SummaryChartProps {
  percentage: number;
  totalIncome: number;
  totalExpense: number;
  selisih: number;
}

const SummaryChart = ({
  percentage,
  totalIncome,
  totalExpense,
  selisih,
}: SummaryChartProps) => {
  // Determine chart color based on percentage
  const getChartColor = () => {
    if (percentage > 90) return Colors.error;
    if (percentage > 70) return Colors.warning;
    return 'white';
  };

  return (
    <View style={styles.summaryCard}>
      <View style={styles.chartContainer}>
        <View style={styles.chartWrapper}>
          <DonutChart
            percentage={percentage}
            color={getChartColor()}
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
            name={'podium' as any}
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
            <Text style={styles.summaryAmount}>{formatCurrency(selisih)}</Text>
          </View>
        </View>

        <View style={styles.summaryItem}>
          <Ionicons
            name={'arrow-down' as any}
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
            name={'arrow-up' as any}
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
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
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
});

export default SummaryChart;
