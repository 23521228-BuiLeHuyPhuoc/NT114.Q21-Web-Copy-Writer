'use client';

import { AdminRoute } from '@/app/_shared/route-guards';
import { AdminUsers } from './Users';

export default function AdminUsersPage() {
  return (
    <AdminRoute path="/admin/users">
      <AdminUsers />
    </AdminRoute>
  );
}
