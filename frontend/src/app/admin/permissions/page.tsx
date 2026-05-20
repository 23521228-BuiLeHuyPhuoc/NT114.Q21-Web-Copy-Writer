'use client';

import { AdminRoute } from '@/app/_shared/route-guards';
import { AdminPermissions } from './Permissions';

export default function AdminPermissionsPage() {
  return (
    <AdminRoute path="/admin/permissions">
      <AdminPermissions />
    </AdminRoute>
  );
}
