import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface PeriodTabsProps {
  activePeriod: string;
  handlePeriodChange: (period: string) => void;
}

const PeriodTabs = ({ activePeriod, handlePeriodChange }: PeriodTabsProps) => {
  return (
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
            activePeriod === 'three_months' && styles.activePeriodTabText,
          ]}
        >
          Tiga bulan
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  periodTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});

export default PeriodTabs;
