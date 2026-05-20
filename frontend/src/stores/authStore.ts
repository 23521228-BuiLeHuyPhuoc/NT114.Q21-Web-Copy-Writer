import { create } from 'zustand';
import { api } from '@/lib/axios';
import {
  ADMIN_INVITE_CODE,
  type RegisterData,
  type StoredUser,
  type User,
  type UserStatus,
} from '@/types/auth';

type AccountType = 'user' | 'admin';

interface AuthApiResponse {
  success: boolean;
  message?: string;
  data?: {
    token?: string;
    user?: User;
  };
}

const INITIAL_MOCK_USERS: StoredUser[] = [
  { id: '1', email: 'admin@copypro.vn', password: 'admin123', name: 'Demo Admin', role: 'admin', adminRole: 'super_admin', status: 'active', createdAt: '2025-01-01' },
  { id: '2', email: 'customer@copypro.vn', password: 'customer123', name: 'Demo Customer', role: 'customer', status: 'active', createdAt: '2025-03-01' },
  { id: '3', email: 'content@copypro.vn', password: 'content123', name: 'Content Manager', role: 'admin', adminRole: 'content_manager', status: 'active', createdAt: '2025-06-01' },
  { id: '4', email: 'users@copypro.vn', password: 'users123', name: 'User Manager', role: 'admin', adminRole: 'user_manager', status: 'active', createdAt: '2025-06-01' },
  { id: '5', email: 'finance@copypro.vn', password: 'finance123', name: 'Finance Manager', role: 'admin', adminRole: 'finance_manager', status: 'active', createdAt: '2025-06-01' },
  { id: '6', email: 'ai@copypro.vn', password: 'ai123', name: 'AI Engineer', role: 'admin', adminRole: 'ai_engineer', status: 'active', createdAt: '2025-06-01' },
  { id: '7', email: 'analyst@copypro.vn', password: 'analyst123', name: 'Analyst', role: 'admin', adminRole: 'analyst', status: 'active', createdAt: '2025-06-01' },
  { id: '8', email: 'pending1@copypro.vn', password: 'pending123', name: 'Pending Admin 1', role: 'admin', adminRole: 'content_manager', status: 'pending', createdAt: '2026-03-20' },
  { id: '9', email: 'pending2@copypro.vn', password: 'pending123', name: 'Pending Admin 2', role: 'admin', adminRole: 'analyst', status: 'pending', createdAt: '2026-03-22' },
];

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function getStoredUsers(): StoredUser[] {
  if (!canUseStorage()) return [...INITIAL_MOCK_USERS];

  try {
    const raw = localStorage.getItem('mock_users');
    return raw ? JSON.parse(raw) : [...INITIAL_MOCK_USERS];
  } catch {
    return [...INITIAL_MOCK_USERS];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  if (canUseStorage()) {
    localStorage.setItem('mock_users', JSON.stringify(users));
  }
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
  addUser: (data: Omit<StoredUser, 'id' | 'createdAt'> & { createdAt?: string }) => StoredUser;
  approveAdmin: (id: string) => void;
  rejectAdmin: (id: string) => void;
  updateUser: (id: string, updates: Partial<Omit<StoredUser, 'id' | 'password' | 'createdAt'>>) => void;
  getPendingAdmins: () => StoredUser[];
  getAllUsers: () => StoredUser[];
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,

  hydrate: async () => {
    if (!canUseStorage()) {
      set({ isLoading: false });
      return;
    }

    if (!localStorage.getItem('mock_users')) {
      saveStoredUsers(INITIAL_MOCK_USERS);
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

  addUser: (data) => {
    const users = getStoredUsers();
    if (users.find((u) => u.email === data.email)) {
      throw new Error('Email nay da duoc su dung');
    }

    const newUser: StoredUser = {
      ...data,
      id: Date.now().toString(),
      createdAt: data.createdAt || new Date().toISOString().split('T')[0],
    };
    saveStoredUsers([...users, newUser]);
    return newUser;
  },

  approveAdmin: (id) => {
    const users = getStoredUsers();
    saveStoredUsers(users.map((u) => (u.id === id ? { ...u, status: 'active' as UserStatus } : u)));
  },

  rejectAdmin: (id) => {
    const users = getStoredUsers();
    saveStoredUsers(users.map((u) => (u.id === id ? { ...u, status: 'rejected' as UserStatus } : u)));
  },

  updateUser: (id, updates) => {
    const users = getStoredUsers();
    const nextUsers = users.map((u) => (u.id === id ? { ...u, ...updates } : u));
    saveStoredUsers(nextUsers);

    const currentRaw = canUseStorage() ? localStorage.getItem('user') : null;
    if (currentRaw) {
      const current = JSON.parse(currentRaw) as User;
      if (current.id === id) {
        const updated = nextUsers.find((u) => u.id === id);
        if (updated) {
          const { password: _, ...rest } = updated;
          set({ user: rest as User });
          localStorage.setItem('user', JSON.stringify(rest));
        }
      }
    }
  },

  getPendingAdmins: () => getStoredUsers().filter((u) => u.role === 'admin' && u.status === 'pending'),
  getAllUsers: () => getStoredUsers(),
}));
