'use client';

import { ProtectedRoute } from '@/app/_shared/route-guards';
import { CustomerTemplates } from './Templates';

export default function Templates() {
  return (
    <ProtectedRoute requiredRole="customer">
      <CustomerTemplates />
    </ProtectedRoute>
  );
}
