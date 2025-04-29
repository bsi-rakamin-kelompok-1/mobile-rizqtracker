export interface PeriodRange {
  start: string;
  end: string;
}

export interface CashflowSummary {
  success: boolean;
  message: string;
  period: PeriodRange;
  summary: {
    income: {
      total_topup: number;
      total_transfer: number;
    };
    expense: {
      total_needs: number;
      total_bills: number;
      total_shopping: number;
      total_transport: number;
      total_transfer_of_wealth: number;
    };
  };
}

export interface IncomeDetails {
  success: boolean;
  message: string;
  period: PeriodRange;
  income_details: {
    topup_data: Array<{
      transaction_id: string;
      topup_method: string;
      amount: number;
      notes: string;
      created_at: string;
    }>;
    transfer_data: Array<{
      transaction_id: string;
      transaction_category: string;
      sender_full_name: string;
      sender_account_number: number;
      amount: number;
      notes: string;
      created_at: string;
    }>;
  };
}

export interface ExpenseDetails {
  success: boolean;
  message: string;
  period: PeriodRange;
  expense_details: {
    needs: Array<TransactionItem>;
    bills: Array<TransactionItem>;
    shopping: Array<TransactionItem>;
    transport: Array<TransactionItem>;
    transfer_of_wealth: Array<TransactionItem>;
  };
}

export interface TransactionItem {
  transaction_id: string;
  recipient_full_name: string;
  recipient_account_number: number;
  amount: number;
  notes: string;
  created_at: string;
}

export interface FormattedTransaction {
  transaction_id: string;
  type: string;
  description: string;
  date: string;
  amount: number;
  notes: string;
  created_at: string;
  iconColor: string;
  backgroundColor: string;
  [key: string]: any; // For additional properties
}

export interface CategoryItem {
  name: string;
  amount: number;
  count: number;
  icon: string;
  iconColor: string;
  backgroundColor: string;
}