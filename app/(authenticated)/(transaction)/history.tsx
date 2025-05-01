import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import Colors, { transactionColors } from '@/constants/Colors';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { useAdaptiveToast } from '@/utils/toast';
import {
  formatCurrency,
  formatPaymentMethod,
  formatTransactionCategory,
} from '@/utils/formatters';
import { format, parse } from 'date-fns';
import { id } from 'date-fns/locale';
import { Picker } from '@react-native-picker/picker';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useAuthStore } from '@/store/auth-store';

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

interface TransactionResponse {
  success: boolean;
  message: string;
  meta: PaginationMeta;
  data: Transaction[];
}

// Add this helper function for formatting period strings to Indonesian month names
const formatPeriod = (periodString: string): string => {
  try {
    const [year, month] = periodString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return format(date, 'MMMM yyyy', { locale: id });
  } catch (error) {
    return periodString;
  }
};

const TransactionHistoryPage = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const axios = useAxiosPrivate();
  const toast = useAdaptiveToast();
  const { user } = useAuthStore();

  const queryClient = useQueryClient();
  const listRef = useRef<FlatList>(null);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    size: 20,
    sort_by: 'createdAt',
    sort_type: 'desc',
    transaction_type: '',
    transfer_category: '',
    topup_method: '',
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchTransactions = async ({ pageParam = 1 }) => {
    const queryParams = [
      `page=${pageParam}`,
      `size=${filters.size}`,
      `sort_by=${filters.sort_by}`,
      `sort_type=${filters.sort_type}`,
      filters.transaction_type &&
        `transaction_type=${filters.transaction_type}`,
      filters.transfer_category &&
        `transfer_category=${filters.transfer_category}`,
      filters.topup_method && `topup_method=${filters.topup_method}`,
      search && `search=${search}`,
    ]
      .filter(Boolean)
      .join('&');

    const response = await axios.get(`/v1/transactions?${queryParams}`);
    return response.data;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['transactions', filters, search],
    queryFn: fetchTransactions,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.has_next ? lastPage.meta.current_page + 1 : undefined,
    refetchOnWindowFocus: false,
  });

  // Add this query to fetch available periods
  const { data: periodsData } = useQuery({
    queryKey: ['transaction-periods'],
    queryFn: async () => {
      const response = await axios.get('/v1/transactions/available-periods');
      return response.data;
    },
  });

  // Available periods from the API response
  const availablePeriods = periodsData || [];

  const handleSearch = () => {
    refetch();
  };

  const clearFilters = () => {
    setFilters({
      size: 20,
      sort_by: 'createdAt',
      sort_type: 'desc',
      transaction_type: '',
      transfer_category: '',
      topup_method: '',
    });
    setSearch('');
    setIsFilterVisible(false);

    queryClient.invalidateQueries({
      queryKey: ['transactions'],
    });
  };

  const applyFilters = () => {
    setIsFilterVisible(false);
    refetch();
  };

  const downloadReport = useCallback(async () => {
    if (!selectedPeriod) {
      toast.error('Pilih periode terlebih dahulu');
      return;
    }

    try {
      setIsDownloading(true);

      const response = await axios.get(
        `/v1/transactions/generate-pdf?period=${selectedPeriod}`,
        {
          responseType: 'blob',
        }
      );

      const fileName = `laporan-transaksi-${selectedPeriod}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;

      const fr = new FileReader();
      fr.onload = async () => {
        try {
          const base64data = (fr.result as string).split(',')[1];

          await FileSystem.writeAsStringAsync(fileUri, base64data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          await Sharing.shareAsync(fileUri, {
            UTI: 'com.adobe.pdf',
            mimeType: 'application/pdf',
          });

          toast.success('Laporan berhasil diunduh');
        } catch (error) {
          console.error('Error saving file:', error);
          toast.error('Gagal menyimpan laporan');
        } finally {
          setIsDownloading(false);
        }
      };

      fr.onerror = () => {
        toast.error('Gagal memproses file');
        setIsDownloading(false);
      };

      fr.readAsDataURL(response.data);
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Gagal mengunduh laporan');
      setIsDownloading(false);
    }
  }, [selectedPeriod, axios, toast]);

  const getTransactionIcon = (transaction: Transaction, isRecipient = false): string => {
    if (transaction.transaction_type === 'topup') {
      return 'arrow-up-circle';
    } else if (transaction.transaction_type === 'transfer') {
      if (isRecipient) {
        return 'arrow-down-circle';
      }
      
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

  const getTransactionTitle = (transaction: Transaction, isRecipient = false): string => {
    if (transaction.transaction_type === 'topup') {
      return `Top Up via ${formatPaymentMethod(transaction.topup_method || '')}`;
    } else if (transaction.transaction_type === 'transfer') {
      if (isRecipient) {
        return `Transfer Masuk - ${formatTransactionCategory(transaction.transfer_category || '')}`;
      }
      return `Transfer - ${formatTransactionCategory(transaction.transfer_category || '')}`;
    }
    return 'Transaksi';
  };

  const getTransactionSubtitle = (transaction: Transaction, isRecipient = false): string => {
    if (transaction.transaction_type === 'topup') {
      return transaction.reference_number;
    } else if (transaction.transaction_type === 'transfer') {
      if (isRecipient && transaction.sender_full_name) {
        return `Dari: ${transaction.sender_full_name}`;
      } else if (transaction.recipient_full_name) {
        return `Ke: ${transaction.recipient_full_name}`;
      }
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

  const transactions = data?.pages?.flatMap((page) => page.data) || [];

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const isRecipient =
      item.transaction_type === 'transfer' &&
      user?.account?.account_number === item.recipient_account_number;

    const isIncome = item.transaction_type === 'topup' || isRecipient;

    let colorSet;
    if (isIncome) {
      colorSet = transactionColors.topup;
    } else if (item.transfer_category) {
      colorSet =
        transactionColors[
          item.transfer_category as keyof typeof transactionColors
        ] || transactionColors.default;
    } else {
      colorSet = transactionColors.default;
    }

    return (
      <View style={styles.transactionItem}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colorSet.background },
          ]}
        >
          <Ionicons
            name={getTransactionIcon(item, isRecipient) as any}
            size={18}
            color={colorSet.icon}
          />
        </View>

        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>
            {getTransactionTitle(item, isRecipient)}
          </Text>
          <Text style={styles.transactionSubtitle}>
            {getTransactionSubtitle(item, isRecipient)}
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
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loaderFooter}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  };

  const ListEmptyComponent = () => {
    if (status === 'pending') return null;
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
          <View style={styles.reportContainer}>
            <Text style={styles.reportTitle}>Laporan Transaksi Bulanan</Text>
            <View style={styles.reportActionRow}>
              <View style={styles.periodPickerContainer}>
                <Picker
                  selectedValue={selectedPeriod}
                  style={styles.periodPicker}
                  itemStyle={styles.periodPickerItem}
                  onValueChange={(itemValue) => setSelectedPeriod(itemValue)}
                >
                  <Picker.Item label='Pilih Periode' value='' />
                  {availablePeriods.map((period: string) => (
                    <Picker.Item
                      key={period}
                      label={formatPeriod(period)}
                      value={period}
                    />
                  ))}
                </Picker>
              </View>

              <TouchableOpacity
                style={[
                  styles.downloadButton,
                  (!selectedPeriod || isDownloading) && styles.disabledButton,
                ]}
                onPress={downloadReport}
                disabled={!selectedPeriod || isDownloading}
              >
                {isDownloading ? (
                  <ActivityIndicator size='small' color='#FFFFFF' />
                ) : (
                  <>
                    <Ionicons
                      name='download-outline'
                      size={18}
                      color='white'
                      style={styles.downloadIcon}
                    />
                    <Text style={styles.downloadButtonText}>Unduh</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}t
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
                      refetch();
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
                    <Picker.Item label='Terbaru' value='createdAt-desc' />
                    <Picker.Item label='Terlama' value='createdAt-asc' />
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

          {/* Transaction List with Infinite Scrolling */}
          {status === 'pending' ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size='large' color={Colors.primary} />
            </View>
          ) : status === 'error' ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Gagal memuat data. Silakan coba lagi.
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => refetch()}
              >
                <Text style={styles.retryText}>Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              ref={listRef}
              data={transactions}
              renderItem={renderTransactionItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={ListEmptyComponent}
              refreshing={isFetching && !isFetchingNextPage}
              onRefresh={() => refetch()}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: 24,
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.error,
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retryText: {
    color: 'white',
    fontWeight: '500',
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
    borderRadius: 8,
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
  reportContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 12,
  },
  reportActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  periodPickerContainer: {
    flex: 1,
    backgroundColor: '#F0F9F6',
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  periodPicker: {
    width: '100%',
  },
  periodPickerItem: {
    fontSize: 14,
  },
  downloadButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadIcon: {
    marginRight: 6,
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: '#AAAAAA',
    opacity: 0.7,
  },
});

export default TransactionHistoryPage;
