import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar as RNStatusBar,
  Platform,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { useAdaptiveToast } from '@/utils/toast';
import {
  formatCurrency,
  formatPaymentMethod,
  formatTransactionCategory,
} from '@/utils/formatters';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Picker } from '@react-native-picker/picker';

// Define transaction type
interface Transaction {
  id: string;
  sender_full_name: string;
  sender_account_number: number;
  recipient_full_name: string | null;
  recipient_account_number: number | null;
  transaction_type: 'transfer' | 'topup';
  transfer_category: string | null;
  topup_method: string | null;
  amount: number;
  notes: string;
  reference_number: string;
  created_at: string;
}

interface PaginationMeta {
  total: number;
  total_pages: number;
  current_page: number;
  size: number;
  has_next: boolean;
  has_previous: boolean;
}

const TransactionHistoryPage = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const axios = useAxiosPrivate();
  const toast = useAdaptiveToast();

  // State variables
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    size: 20,
    sort_by: 'createdAt',
    sort_type: 'desc',
    transaction_type: '',
    transfer_category: '',
    topup_method: '',
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async (resetPage = false) => {
    setIsLoading(true);

    try {
      const params = {
        page: resetPage ? 1 : filters.page,
        size: filters.size,
        sort_by: filters.sort_by,
        sort_type: filters.sort_type,
        search: search || undefined,
        transaction_type: filters.transaction_type || undefined,
        transfer_category: filters.transfer_category || undefined,
        topup_method: filters.topup_method || undefined,
      };

      const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      const response = await axios.get(`/v1/transactions?${queryString}`);

      if (response.data.success) {
        if (resetPage || filters.page === 1) {
          setTransactions(response.data.data);
        } else {
          setTransactions((prev) => [...prev, ...response.data.data]);
        }
        setMeta(response.data.meta);
      } else {
        throw new Error(
          response.data.message || 'Failed to fetch transactions'
        );
      }
    } catch (error: any) {
      console.error('Error fetching transactions:', error?.response.data);
      toast.error('Gagal memuat riwayat transaksi', {
        description: 'Silakan coba lagi nanti',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (meta?.has_next) {
      setFilters((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
    }));
    fetchTransactions(true);
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      size: 20,
      sort_by: 'createdAat',
      sort_type: 'desc',
      transaction_type: '',
      transfer_category: '',
      topup_method: '',
    });
    setSearch('');
    setIsFilterVisible(false);
  };

  const applyFilters = () => {
    fetchTransactions(true);
    setIsFilterVisible(false);
  };

  const getTransactionIcon = (transaction: Transaction): string => {
    if (transaction.transaction_type === 'topup') {
      return 'arrow-up-circle';
    } else if (transaction.transaction_type === 'transfer') {
      switch (transaction.transfer_category) {
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
          return 'swap-horizontal';
      }
    }
    return 'cash';
  };

  const getTransactionTitle = (transaction: Transaction): string => {
    if (transaction.transaction_type === 'topup') {
      return `Top Up via ${formatPaymentMethod(
        transaction.topup_method || ''
      )}`;
    } else {
      return `Transfer - ${formatTransactionCategory(
        transaction.transfer_category || ''
      )}`;
    }
  };

  const getTransactionSubtitle = (transaction: Transaction): string => {
    if (transaction.transaction_type === 'topup') {
      return `${transaction.reference_number}`;
    } else if (
      transaction.transaction_type === 'transfer' &&
      transaction.recipient_full_name
    ) {
      return `Ke: ${transaction.recipient_full_name}`;
    }
    return transaction.reference_number;
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy, HH:mm', { locale: id });
    } catch {
      return dateString;
    }
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const isIncome = item.transaction_type === 'topup';

    return (
      <View style={styles.transactionItem}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isIncome
                ? Colors.primaryMuted
                : Colors.secondaryMuted
            },
          ]}
        >
          <Ionicons
            name={getTransactionIcon(item) as any}
            size={18}
            color={isIncome ? 'white' : 'white'}
          />
        </View>

        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>
            {getTransactionTitle(item)}
          </Text>
          <Text style={styles.transactionSubtitle}>
            {getTransactionSubtitle(item)}
          </Text>
          <Text style={styles.transactionDate}>
            {formatDate(item.created_at)}
          </Text>
          {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
        </View>

        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.amount,
              isIncome ? styles.incomeAmount : styles.expenseAmount,
            ]}
          >
            {isIncome ? '+ ' : '- '}
            {formatCurrency(item.amount)}
          </Text>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loaderFooter}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  };

  const ListEmptyComponent = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name='document-text-outline' size={56} color={Colors.gray} />
        <Text style={styles.emptyText}>Belum ada transaksi</Text>
        <Text style={styles.emptySubtext}>
          Transaksi yang kamu lakukan akan muncul di sini
        </Text>
      </View>
    );
  };

  return (
    <>
      <StatusBar style='light' backgroundColor={Colors.primary} />
      <SafeAreaView style={styles.container}>
        <View
          style={[
            styles.header,
            {
              paddingTop:
                Platform.OS === 'android'
                  ? insets.top > 0
                    ? insets.top
                    : RNStatusBar.currentHeight
                  : 0,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name='arrow-back' size={24} color='white' />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Riwayat Transaksi</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setIsFilterVisible(!isFilterVisible)}
          >
            <Ionicons name='options-outline' size={24} color='white' />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons
                name='search'
                size={18}
                color={Colors.gray}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder='Cari transaksi...'
                value={search}
                onChangeText={setSearch}
                returnKeyType='search'
                onSubmitEditing={handleSearch}
                placeholderTextColor={Colors.gray}
              />
              {search !== '' && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => {
                    setSearch('');
                    if (search !== '') {
                      setFilters((prev) => ({ ...prev, page: 1 }));
                      fetchTransactions(true);
                    }
                  }}
                >
                  <Ionicons name='close-circle' size={16} color={Colors.gray} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Filter Section */}
          {isFilterVisible && (
            <View style={styles.filterContainer}>
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Urutkan</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={`${filters.sort_by}-${filters.sort_type}`}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                      const [sort_by, sort_type] = itemValue.split('-');
                      setFilters((prev) => ({ ...prev, sort_by, sort_type }));
                    }}
                  >
                    <Picker.Item label='Terbaru' value='created_at-desc' />
                    <Picker.Item label='Terlama' value='created_at-asc' />
                    <Picker.Item label='Nominal Terbesar' value='amount-desc' />
                    <Picker.Item label='Nominal Terkecil' value='amount-asc' />
                  </Picker>
                </View>
              </View>

              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Jenis</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filters.transaction_type}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                      setFilters((prev) => ({
                        ...prev,
                        transaction_type: itemValue,
                        // Clear dependent filters
                        transfer_category:
                          itemValue === 'transfer'
                            ? prev.transfer_category
                            : '',
                        topup_method:
                          itemValue === 'topup' ? prev.topup_method : '',
                      }));
                    }}
                  >
                    <Picker.Item label='Semua' value='' />
                    <Picker.Item label='Top Up' value='topup' />
                    <Picker.Item label='Transfer' value='transfer' />
                  </Picker>
                </View>
              </View>

              {filters.transaction_type === 'transfer' && (
                <View style={styles.filterRow}>
                  <Text style={styles.filterLabel}>Kategori</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={filters.transfer_category}
                      style={styles.picker}
                      onValueChange={(itemValue) => {
                        setFilters((prev) => ({
                          ...prev,
                          transfer_category: itemValue,
                        }));
                      }}
                    >
                      <Picker.Item label='Semua Kategori' value='' />
                      <Picker.Item label='Kebutuhan' value='needs' />
                      <Picker.Item label='Belanja' value='shopping' />
                      <Picker.Item label='Transportasi' value='transport' />
                      <Picker.Item label='Tagihan' value='bills' />
                      <Picker.Item
                        label='Transfer Kekayaan'
                        value='transfer_of_wealth'
                      />
                    </Picker>
                  </View>
                </View>
              )}

              {filters.transaction_type === 'topup' && (
                <View style={styles.filterRow}>
                  <Text style={styles.filterLabel}>Metode</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={filters.topup_method}
                      style={styles.picker}
                      onValueChange={(itemValue) => {
                        setFilters((prev) => ({
                          ...prev,
                          topup_method: itemValue,
                        }));
                      }}
                    >
                      <Picker.Item label='Semua Metode' value='' />
                      <Picker.Item label='Kartu Debit' value='debit_card' />
                      <Picker.Item label='Kartu Kredit' value='credit_card' />
                      <Picker.Item
                        label='Transfer Bank'
                        value='bank_transfer'
                      />
                    </Picker>
                  </View>
                </View>
              )}

              <View style={styles.filterButtonsContainer}>
                <TouchableOpacity
                  style={[styles.filterActionButton, styles.clearFilterButton]}
                  onPress={clearFilters}
                >
                  <Text style={styles.clearFilterButtonText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterActionButton, styles.applyFilterButton]}
                  onPress={applyFilters}
                >
                  <Text style={styles.applyFilterButtonText}>Terapkan</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Transaction List */}
          <FlatList
            data={transactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={ListEmptyComponent}
            refreshing={isLoading && filters.page === 1}
            onRefresh={() => fetchTransactions(true)}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 4,
  },
  filterButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.dark,
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark,
    width: '30%',
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  filterActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 12,
  },
  clearFilterButton: {
    backgroundColor: '#EEEEEE',
  },
  clearFilterButtonText: {
    color: Colors.dark,
    fontSize: 14,
    fontWeight: '500',
  },
  applyFilterButton: {
    backgroundColor: Colors.primary,
  },
  applyFilterButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark,
    marginBottom: 2,
  },
  transactionSubtitle: {
    fontSize: 13,
    color: Colors.gray,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 2,
  },
  notes: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.gray,
  },
  amountContainer: {
    justifyContent: 'center',
    paddingLeft: 12,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  incomeAmount: {
    color: Colors.primary,
  },
  expenseAmount: {
    color: Colors.error,
  },
  loaderFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 300,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark,
    marginVertical: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
  },
});

export default TransactionHistoryPage;
