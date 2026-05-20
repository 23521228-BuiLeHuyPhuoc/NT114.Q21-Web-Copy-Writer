'use client';

import { ProtectedRoute } from '@/app/_shared/route-guards';
import { CustomerDashboard } from './Dashboard';

export default function Dashboard() {
  return (
    <ProtectedRoute requiredRole="customer">
      <CustomerDashboard />
    </ProtectedRoute>
  );
}
