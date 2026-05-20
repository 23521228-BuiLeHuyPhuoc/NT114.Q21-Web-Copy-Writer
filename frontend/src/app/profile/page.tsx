'use client';

import { ProtectedRoute } from '@/app/_shared/route-guards';
import { CustomerProfile } from './Profile';

export default function Profile() {
  return (
    <ProtectedRoute requiredRole="customer">
      <CustomerProfile />
    </ProtectedRoute>
  );
}
