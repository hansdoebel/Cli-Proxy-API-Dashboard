import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Shared page frame: one max width, one gutter, one vertical rhythm. */
export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('page-container', className)}>{children}</div>;
}

export function PageHeader({
  title,
  actions,
}: {
  title: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <h1 className="page-header-title">{title}</h1>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </header>
  );
}
