import { useQuery } from '@tanstack/react-query';
import { apiKeyService } from '@/services/apiKeyService';

export const apiKeyKeys = {
  all: ['apiKeys'] as const,
  keys: () => [...apiKeyKeys.all, 'keys'] as const,
  logs: () => [...apiKeyKeys.all, 'logs'] as const,
};

export function useApiKeys() {
  return useQuery({
    queryKey: apiKeyKeys.keys(),
    queryFn: () => apiKeyService.listKeys(),
  });
}

export function useApiKeyLogs() {
  return useQuery({
    queryKey: apiKeyKeys.logs(),
    queryFn: () => apiKeyService.listLogs(),
  });
}
