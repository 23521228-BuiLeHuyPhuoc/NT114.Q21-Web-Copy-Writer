'use client';

import { ProtectedRoute } from '@/app/_shared/route-guards';
import { CustomerNotifications } from './Notifications';

export default function Notifications() {
  return (
    <ProtectedRoute requiredRole="customer">
      <CustomerNotifications />
    </ProtectedRoute>
  );
}
