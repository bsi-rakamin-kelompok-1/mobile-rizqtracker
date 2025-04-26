import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface CashflowTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CashflowTabs = ({ activeTab, setActiveTab }: CashflowTabsProps) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'pemasukan' && styles.activeTab]}
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
        style={[styles.tab, activeTab === 'pengeluaran' && styles.activeTab]}
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
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
    overflow: 'hidden',
    marginBottom: 8,
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
});

export default CashflowTabs;
