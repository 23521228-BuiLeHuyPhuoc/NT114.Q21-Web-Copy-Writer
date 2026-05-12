import { useQuery } from '@tanstack/react-query';
import { fineTuningService } from '@/services/fineTuningService';

export const fineTuningKeys = {
  all: ['fineTuning'] as const,
  models: () => [...fineTuningKeys.all, 'models'] as const,
  trainingLog: () => [...fineTuningKeys.all, 'trainingLog'] as const,
  examplePairs: () => [...fineTuningKeys.all, 'examplePairs'] as const,
};

export function useFineTuningModels() {
  return useQuery({
    queryKey: fineTuningKeys.models(),
    queryFn: () => fineTuningService.listModels(),
  });
}

export function useTrainingLog() {
  return useQuery({
    queryKey: fineTuningKeys.trainingLog(),
    queryFn: () => fineTuningService.getTrainingLog(),
  });
}

export function useExamplePairs() {
  return useQuery({
    queryKey: fineTuningKeys.examplePairs(),
    queryFn: () => fineTuningService.getExamplePairs(),
  });
}
