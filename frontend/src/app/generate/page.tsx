'use client';

import { ProtectedRoute } from '@/app/_shared/route-guards';
import { CustomerGenerator } from './Generator';

export default function Generate() {
  return (
    <ProtectedRoute requiredRole="customer">
      <CustomerGenerator />
    </ProtectedRoute>
  );
}
