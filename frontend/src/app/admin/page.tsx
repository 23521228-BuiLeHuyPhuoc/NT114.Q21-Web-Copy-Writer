'use client';

import { AdminRoute } from '@/app/_shared/route-guards';
import { AdminDashboard } from './Dashboard';

export default function AdminHome() {
  return (
    <AdminRoute path="/admin">
      <AdminDashboard />
    </AdminRoute>
  );
}
