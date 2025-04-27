import privateAxios from '@/lib/axios-private';

interface TransferPayload {
  recipient_account_number: number;
  transfer_category: string;
  amount: number;
  pin: string;
  notes?: string;
}

interface TransferResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    transaction_type: string;
    sender_account_number: number;
    recipient_account_number: number;
    transfer_category: string;
    amount: number;
    notes: string;
    reference_number: string;
    created_at: string;
  };
}

export const transferApi = async (
  payload: TransferPayload,
  token: string
): Promise<TransferResponse> => {
  try {
    const { data } = await privateAxios.post<TransferResponse>(
      '/v1/transactions/transfer',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAccountDetails = async (
  accountNumber: string,
  token: string
) => {
  try {
    const { data } = await privateAxios.get(`/v1/accounts/${accountNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getRecentRecipients = async (token: string) => {
  try {
    const { data } = await privateAxios.get('/v1/accounts/recent-recipients', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};