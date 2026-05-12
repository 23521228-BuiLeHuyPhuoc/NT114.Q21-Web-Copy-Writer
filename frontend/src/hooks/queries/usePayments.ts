import { useQuery } from '@tanstack/react-query';
import { paymentService } from '@/services/paymentService';

export const paymentKeys = {
  all: ['payments'] as const,
  list: () => [...paymentKeys.all, 'list'] as const,
  revenue: () => [...paymentKeys.all, 'revenue'] as const,
};

export function usePayments() {
  return useQuery({
    queryKey: paymentKeys.list(),
    queryFn: () => paymentService.list(),
  });
}

export function useRevenue() {
  return useQuery({
    queryKey: paymentKeys.revenue(),
    queryFn: () => paymentService.getRevenue(),
  });
}
