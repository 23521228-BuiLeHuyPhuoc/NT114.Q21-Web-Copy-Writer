'use client';

import { ProtectedRoute } from '@/app/_shared/route-guards';
import { CustomerContents } from './Contents';

export default function Contents() {
  return (
    <ProtectedRoute requiredRole="customer">
      <CustomerContents />
    </ProtectedRoute>
  );
}
