'use client';

import { AdminRoute } from '@/app/_shared/route-guards';
import { AdminPlans } from './Plans';

export default function AdminPlansPage() {
  return (
    <AdminRoute path="/admin/plans">
      <AdminPlans />
    </AdminRoute>
  );
}
