'use client';

import { ProtectedRoute } from '@/app/_shared/route-guards';
import { CustomerBilling } from './Billing';

export default function Billing() {
  return (
    <ProtectedRoute requiredRole="customer">
      <CustomerBilling />
    </ProtectedRoute>
  );
}
