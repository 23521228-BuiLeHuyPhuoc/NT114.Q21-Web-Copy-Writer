'use client';

import { ProtectedRoute } from '@/app/_shared/route-guards';
import { CustomerPlagiarismCheck } from './PlagiarismCheck';

export default function PlagiarismCheck() {
  return (
    <ProtectedRoute requiredRole="customer">
      <CustomerPlagiarismCheck />
    </ProtectedRoute>
  );
}
