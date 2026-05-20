'use client';

import { ProtectedRoute } from '@/app/_shared/route-guards';
import { CustomerProjectDetail } from './ProjectDetail';

export default function ProjectDetail() {
  return (
    <ProtectedRoute requiredRole="customer">
      <CustomerProjectDetail />
    </ProtectedRoute>
  );
}
