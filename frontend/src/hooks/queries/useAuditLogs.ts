import { useQuery } from '@tanstack/react-query';
import { auditLogService } from '@/services/auditLogService';

export const auditLogKeys = {
  all: ['auditLogs'] as const,
  list: () => [...auditLogKeys.all, 'list'] as const,
};

export function useAuditLogs() {
  return useQuery({
    queryKey: auditLogKeys.list(),
    queryFn: () => auditLogService.list(),
  });
}
