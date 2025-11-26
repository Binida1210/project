import { create } from 'zustand';

import { AuthUser } from '../models/auth';

type AuthenticateOptions = {
  token: string;
  user: AuthUser;
};

export type AuthStoreType = {
  accessToken?: string;
  setAccessToken: (token: string) => void;
  user?: AuthUser;
  isAuthenticated?: boolean;
  setUser: (user: AuthUser) => void;
  authenticate: (options?: AuthenticateOptions) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStoreType>((set) => ({
  setAccessToken: (token: string) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  authenticate: (options) => {
    if (options) {
      const { token, user } = options;
      set({
        accessToken: token,
        user: { id: user.id, name: user.name, role: user.role },
        isAuthenticated: true,
      });
    } else set({ isAuthenticated: false });
  },
  logout: () => set({ accessToken: undefined, user: undefined, isAuthenticated: false }),
}));

