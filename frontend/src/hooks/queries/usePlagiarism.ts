import { useQuery } from '@tanstack/react-query';
import { plagiarismService } from '@/services/plagiarismService';

export const plagiarismKeys = {
  all: ['plagiarism'] as const,
  list: () => [...plagiarismKeys.all, 'list'] as const,
};

export function usePlagiarismResults() {
  return useQuery({
    queryKey: plagiarismKeys.list(),
    queryFn: () => plagiarismService.list(),
  });
}
