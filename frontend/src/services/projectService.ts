import { MOCK_PROJECTS } from '@/mocks/projects';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const projectService = {
  list: async () => {
    await delay();
    return MOCK_PROJECTS;
  },
};
