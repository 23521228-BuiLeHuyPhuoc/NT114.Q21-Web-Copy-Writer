import { useQuery } from '@tanstack/react-query';
import { notificationService } from '@/services/notificationService';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
  header: () => [...notificationKeys.all, 'header'] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => notificationService.list(),
  });
}

export function useHeaderNotifications() {
  return useQuery({
    queryKey: notificationKeys.header(),
    queryFn: () => notificationService.listHeader(),
  });
}
