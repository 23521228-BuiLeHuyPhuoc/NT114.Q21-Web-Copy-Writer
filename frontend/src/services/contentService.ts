import { MOCK_CONTENTS, MOCK_CONTENT } from '@/mocks/contents';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const contentService = {
  list: async () => {
    await delay();
    return MOCK_CONTENTS;
  },
  get: async (_id: string) => {
    await delay();
    return MOCK_CONTENT;
  },
};
