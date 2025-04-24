import privateAxios from "@/lib/axios-private";

interface SetPinPayload {
  pin: string;
  confirm_pin: string;
}

interface SetPinResponse {
  success: boolean;
  message: string;
}

export const setPinApi = async (
  pinData: SetPinPayload, 
  token: string
): Promise<SetPinResponse> => {
  const { data } = await privateAxios.post<SetPinResponse>(
    '/v1/users/set-pin', 
    pinData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  return data;
};