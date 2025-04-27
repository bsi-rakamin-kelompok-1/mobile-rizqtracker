// Transfer category type
export type TransferCategory =
  | 'shopping'
  | 'needs'
  | 'transport'
  | 'bills'
  | 'transfer_of_wealth';

export const transferCategories: {
    id: TransferCategory;
    label: string;
    icon: string;
  }[] = [
    { id: 'needs', label: 'Kebutuhan', icon: 'basket' },
    { id: 'shopping', label: 'Belanja', icon: 'cart' },
    { id: 'transport', label: 'Transportasi', icon: 'car' },
    { id: 'bills', label: 'Tagihan', icon: 'receipt' },
    { id: 'transfer_of_wealth', label: 'Lain-lain', icon: 'wallet' },
  ];