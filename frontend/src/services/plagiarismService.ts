import { MOCK_RESULTS } from '@/mocks/plagiarism';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const plagiarismService = {
  list: async () => {
    await delay();
    return MOCK_RESULTS;
  },
};
