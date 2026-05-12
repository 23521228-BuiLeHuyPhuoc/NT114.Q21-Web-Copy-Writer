import { useAuthStore } from '@/stores/authStore';
import type { RegisterData, User } from '@/types/auth';

export type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading';

export interface Session {
  user: User | null;
  status: SessionStatus;
}

/** NextAuth-style hook backed by Zustand. */
export function useSession(): Session {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const status: SessionStatus = isLoading
    ? 'loading'
    : user
      ? 'authenticated'
      : 'unauthenticated';
  return { user, status };
}

export async function signIn(email: string, password: string) {
  return useAuthStore.getState().login(email, password);
}

export async function signUp(data: RegisterData) {
  return useAuthStore.getState().register(data);
}

export function signOut() {
  useAuthStore.getState().logout();
}
