import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[var(--bg-hover)] text-[var(--foreground)]',
        secondary: 'border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)]',
        outline: 'border-[var(--border)] text-[var(--text-secondary)]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
