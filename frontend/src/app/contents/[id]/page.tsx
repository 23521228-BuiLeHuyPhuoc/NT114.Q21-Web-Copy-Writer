'use client';

import { ProtectedRoute } from '@/app/_shared/route-guards';
import { CustomerContentDetail } from './ContentDetail';

export default function ContentDetail() {
  return (
    <ProtectedRoute requiredRole="customer">
      <CustomerContentDetail />
    </ProtectedRoute>
  );
}
