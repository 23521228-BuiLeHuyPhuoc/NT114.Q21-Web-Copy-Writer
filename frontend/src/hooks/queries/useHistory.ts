import { useQuery } from '@tanstack/react-query';
import { historyService } from '@/services/historyService';

export const historyKeys = {
  all: ['history'] as const,
  list: () => [...historyKeys.all, 'list'] as const,
};

export function useHistory() {
  return useQuery({
    queryKey: historyKeys.list(),
    queryFn: () => historyService.list(),
  });
}
