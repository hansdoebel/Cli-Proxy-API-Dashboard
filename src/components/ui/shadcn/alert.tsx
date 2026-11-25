import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

function Alert({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      className={cn(
        'rounded-[var(--card-radius)] border border-[var(--border)] bg-[var(--card)] px-[var(--card-padding)] py-3 text-sm leading-normal text-[var(--text-secondary)]',
        className
      )}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('mb-1 text-base font-medium text-[var(--foreground)]', className)} {...props} />;
}

function AlertDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm leading-normal', className)} {...props} />;
}

export { Alert, AlertDescription, AlertTitle };
