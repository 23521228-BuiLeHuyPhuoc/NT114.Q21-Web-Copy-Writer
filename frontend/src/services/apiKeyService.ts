import { MOCK_KEYS, MOCK_LOGS } from '@/mocks/apiKeys';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const apiKeyService = {
  listKeys: async () => {
    await delay();
    return MOCK_KEYS;
  },
  listLogs: async () => {
    await delay();
    return MOCK_LOGS;
  },
};
