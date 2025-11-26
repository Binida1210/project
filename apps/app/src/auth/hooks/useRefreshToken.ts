import { privateApi } from '../../axios/axios';
import { AuthenticateResponse } from '../models';
import { useAuthStore } from '../store';

export const useRefreshToken = () => {
  const { authenticate } = useAuthStore(({ user, authenticate }) => ({ user, authenticate }));

  const refresh = async () => {
    try {
      const response = await privateApi.post<AuthenticateResponse>(`auth/refresh-token`, {}, { timeout: 5000 });

      const { id, name, role, jwtToken } = response.data;

      authenticate({ token: jwtToken, user: { id, name, role } });
    } catch (error) {
      authenticate();
    }
  };

  return refresh;
};



