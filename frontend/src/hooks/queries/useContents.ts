import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services/contentService';

export const contentKeys = {
  all: ['contents'] as const,
  list: () => [...contentKeys.all, 'list'] as const,
  detail: (id: string) => [...contentKeys.all, 'detail', id] as const,
};

export function useContents() {
  return useQuery({
    queryKey: contentKeys.list(),
    queryFn: () => contentService.list(),
  });
}

export function useContent(id: string) {
  return useQuery({
    queryKey: contentKeys.detail(id),
    queryFn: () => contentService.get(id),
    enabled: !!id,
  });
}
