import type { ReactNode } from 'react';
import { Card } from '@/app/components/ui/card';
import { Table } from '@/app/components/ui/table';

export interface AdminTableProps {
  children: ReactNode;
  /** Optional empty-state element shown after the table */
  empty?: ReactNode;
  className?: string;
}

/**
 * Thin wrapper around `<Card><Table>...` with horizontal-overflow handling.
 * Pass standard shadcn TableHeader / TableBody / TableRow children inside.
 */
export function AdminTable({ children, empty, className = '' }: AdminTableProps) {
  return (
    <Card className={className}>
      <div className="overflow-x-auto">
        <Table>{children}</Table>
      </div>
      {empty}
    </Card>
  );
}
