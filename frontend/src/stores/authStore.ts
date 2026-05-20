import { create } from 'zustand';
import { api } from '@/lib/axios';
import type { RegisterData, User } from '@/types/auth';

type AccountType = 'user' | 'admin';

interface AuthApiResponse {
  success: boolean;
  message?: string;
  data?: {
    token?: string;
    user?: User;
  };
}

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function saveSession(token: string, user: User) {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

function clearSession() {
  if (!canUseStorage()) return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
}

function accountTypeFromUser(user: User | null): AccountType {
  return user?.role === 'admin' ? 'admin' : 'user';
}

function getErrorMessage(error: unknown, fallback: string) {
  const err = error as { response?: { data?: { message?: string } }; message?: string };
  return err.response?.data?.message || err.message || fallback;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string, accountType?: AccountType) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,

  hydrate: async () => {
    if (!canUseStorage()) {
      set({ isLoading: false });
      return;
    }

    const token = localStorage.getItem('auth_token');
    const savedUserRaw = localStorage.getItem('user');

    if (!token || !savedUserRaw) {
      clearSession();
      set({ user: null, isLoading: false });
      return;
    }

    try {
      const savedUser = JSON.parse(savedUserRaw) as User;
      const accountType = accountTypeFromUser(savedUser);
      const response = await api.get<AuthApiResponse>(`/auth/${accountType}/me`);
      const hydratedUser = response.data.data?.user;

      if (!hydratedUser) {
        throw new Error('Invalid auth response');
      }

      localStorage.setItem('user', JSON.stringify(hydratedUser));
      set({ user: hydratedUser, isLoading: false });
    } catch {
      clearSession();
      set({ user: null, isLoading: false });
    }
  },

  login: async (email, password, accountType = 'user') => {
    try {
      const response = await api.post<AuthApiResponse>(`/auth/${accountType}/login`, {
        email,
        password,
      });

      const token = response.data.data?.token;
      const user = response.data.data?.user;

      if (!token || !user) {
        throw new Error('Invalid auth response');
      }

      saveSession(token, user);
      set({ user });
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Email hoac mat khau khong dung'));
    }
  },

  register: async (data) => {
    const accountType: AccountType = data.role === 'admin' ? 'admin' : 'user';
    const payload = accountType === 'admin'
      ? {
          name: data.name,
          email: data.email,
          password: data.password,
          adminRole: data.adminRole,
          inviteCode: data.inviteCode,
        }
      : {
          name: data.name,
          email: data.email,
          password: data.password,
        };

    try {
      await api.post<AuthApiResponse>(`/auth/${accountType}/register`, payload);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Dang ky that bai'));
    }
  },

  logout: async () => {
    const currentUser = get().user;
    const accountType = accountTypeFromUser(currentUser);
    const token = canUseStorage() ? localStorage.getItem('auth_token') : null;

    clearSession();
    set({ user: null });

    try {
      if (token) {
        await api.post(`/auth/${accountType}/logout`, undefined, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Local logout must always finish even if the backend is unreachable.
    }
  },
}));
