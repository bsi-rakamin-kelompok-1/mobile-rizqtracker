import privateAxios from '@/lib/axios-private';

interface RegisterPayload {
  email: string;
  password: string;
  confirm_password: string;
  full_name: string;
  phone_number: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

interface AuthAndUserDetailResponse {
  success: boolean;
  message: string;
  token: string | null;
  data: {
    email: string;
    full_name: string;
    phone_number: string;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
    account: {
      account_number: number;
      balance: number;
    };
  };
}

export const register = async (userData: RegisterPayload): Promise<AuthAndUserDetailResponse> => {
  try {
    const { data } = await privateAxios.post<AuthAndUserDetailResponse>('/v1/auth/register', userData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const login = async (userData: LoginPayload): Promise<AuthAndUserDetailResponse> => {
  try {
    const { data: { token } } = await privateAxios.post<LoginResponse>('/v1/auth/login', userData);

    if (!token) {
      throw new Error('Token not found');
    }

    const { data } = await privateAxios.get<AuthAndUserDetailResponse>('/v1/users/detail', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ...data,
      token,
    };
  } catch (error) {
    throw error;
  }
};