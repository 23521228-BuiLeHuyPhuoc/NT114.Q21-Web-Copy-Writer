'use client';

import { ProtectedRoute } from '@/app/_shared/route-guards';
import { CustomerProjects } from './Projects';

export default function Projects() {
  return (
    <ProtectedRoute requiredRole="customer">
      <CustomerProjects />
    </ProtectedRoute>
  );
}
