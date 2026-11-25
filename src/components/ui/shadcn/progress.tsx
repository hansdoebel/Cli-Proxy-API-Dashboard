import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

function Progress({
  value = 0,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { value?: number }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(width)}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]', className)}
      {...props}
    >
      <div className="h-full rounded-full bg-[var(--success)]" style={{ width: `${width}%` }} />
    </div>
  );
}

export { Progress };
