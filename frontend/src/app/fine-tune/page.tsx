'use client';

import { ProtectedRoute } from '@/app/_shared/route-guards';
import { CustomerFineTuningStudio } from './FineTuningStudio';

export default function FineTune() {
  return (
    <ProtectedRoute requiredRole="customer">
      <CustomerFineTuningStudio />
    </ProtectedRoute>
  );
}
