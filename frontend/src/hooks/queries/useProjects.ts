import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/projectService';

export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: () => projectService.list(),
  });
}
