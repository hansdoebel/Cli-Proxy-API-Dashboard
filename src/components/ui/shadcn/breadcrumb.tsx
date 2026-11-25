import { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

function Breadcrumb({ ...props }: ComponentPropsWithoutRef<'nav'>) {
  return <nav aria-label="Breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: ComponentPropsWithoutRef<'ol'>) {
  return (
    <ol
      className={cn(
        'flex flex-wrap items-center gap-1.5 text-sm text-[var(--text-secondary)]',
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: ComponentPropsWithoutRef<'li'>) {
  return <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />;
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: ComponentPropsWithoutRef<'a'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'a';
  return (
    <Comp
      className={cn('text-[var(--text-secondary)] hover:text-[var(--foreground)]', className)}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      aria-current="page"
      className={cn('font-medium text-[var(--foreground)]', className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({ children }: { children?: ReactNode }) {
  return (
    <li role="presentation" aria-hidden="true" className="text-[var(--text-tertiary)]">
      {children ?? '/'}
    </li>
  );
}

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
