import type { AdminRole } from '@/lib/permissions';

export type UserRole = 'admin' | 'customer';
export type UserStatus = 'active' | 'pending' | 'rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  adminRole?: AdminRole;
  status: UserStatus;
  avatar?: string;
  createdAt?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  adminRole?: AdminRole;
  inviteCode?: string;
}

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  adminRole?: AdminRole;
  status: UserStatus;
  createdAt: string;
  password?: string;
}

export const ADMIN_INVITE_CODE = 'ADMIN2026';
