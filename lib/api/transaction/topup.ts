import privateAxios from "@/lib/axios-private";

export interface TopUpPayload {
  topup_method: 'debit_card' | 'credit_card' | 'bank_transfer';
  amount: number;
  notes: string;
  pin: string;
}

export interface TopUpResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    transaction_type: string;
    sender_account_number: number;
    topup_method: string;
    amount: number;
    notes: string;
    reference_number: string;
    created_at: string;
  };
}

export const topupApi = async (
  topUpData: TopUpPayload,
  token: string
): Promise<TopUpResponse> => {
  const { data } = await privateAxios.post<TopUpResponse>(
    '/v1/transactions/topup',
    topUpData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};