import { MOCK_HISTORY } from '@/mocks/history';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const historyService = {
  list: async () => {
    await delay();
    return MOCK_HISTORY;
  },
};
