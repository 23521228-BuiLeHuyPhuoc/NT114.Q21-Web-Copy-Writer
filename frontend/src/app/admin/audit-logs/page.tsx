'use client';

import { AdminRoute } from '@/app/_shared/route-guards';
import { AdminAuditLogs } from './AuditLogs';

export default function AdminAuditLogsPage() {
  return (
    <AdminRoute path="/admin/audit-logs">
      <AdminAuditLogs />
    </AdminRoute>
  );
}
