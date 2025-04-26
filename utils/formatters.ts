/**
 * Formats a snake_case or underscore_case string to Title Case
 * Example: "debit_card" becomes "Debit Card"
 */
export const formatSnakeCase = (text: string): string => {
  if (!text) return '';

  // Replace underscores with spaces and split into words
  const words = text.split('_');

  // Capitalize the first letter of each word
  const capitalizedWords = words.map(
    word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  // Join the words back together with spaces
  return capitalizedWords.join(' ');
};

/**
 * Formats currency amounts to Indonesian Rupiah format
 * Example: 10000 becomes "Rp 10.000"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace('IDR', 'Rp')
    .replace(/\s/g, '');
};

/**
 * Formats payment methods based on predefined mappings or falls back to formatted snake case
 */
export const formatPaymentMethod = (method: string): string => {
  const methodMappings: Record<string, string> = {
    'debit_card': 'Debit Card',
    'credit_card': 'Credit Card',
    'bank_transfer': 'Bank Transfer',
    // Add more mappings as needed
  };

  return methodMappings[method] || formatSnakeCase(method);
};

/**
 * Formats transaction categories to readable format
 */
export const formatTransactionCategory = (category: string): string => {
  const categoryMappings: Record<string, string> = {
    'needs': 'Kebutuhan',
    'bills': 'Tagihan',
    'shopping': 'Belanja',
    'transport': 'Transportasi',
    'transfer_of_wealth': 'Transfer Kekayaan',
    // Add more mappings as needed
  };

  return categoryMappings[category] || formatSnakeCase(category);
};