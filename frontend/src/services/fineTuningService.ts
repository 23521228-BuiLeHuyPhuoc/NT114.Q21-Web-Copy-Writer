import { MOCK_MODELS, TRAINING_LOG, EXAMPLE_PAIRS } from '@/mocks/fineTuning';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const fineTuningService = {
  listModels: async () => {
    await delay();
    return MOCK_MODELS;
  },
  getTrainingLog: async () => {
    await delay();
    return TRAINING_LOG;
  },
  getExamplePairs: async () => {
    await delay();
    return EXAMPLE_PAIRS;
  },
};
