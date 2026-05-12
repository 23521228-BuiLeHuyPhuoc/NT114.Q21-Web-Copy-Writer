import { MOCK_LOGS } from '@/mocks/auditLogs';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const auditLogService = {
  list: async () => {
    await delay();
    return MOCK_LOGS;
  },
};
