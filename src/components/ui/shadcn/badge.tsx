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
        info: 'border-transparent bg-[color-mix(in_srgb,var(--ring)_18%,transparent)] text-[var(--foreground)]',
        success:
          'border-transparent bg-[color-mix(in_srgb,var(--success)_18%,transparent)] text-[var(--success)]',
        warning:
          'border-transparent bg-[color-mix(in_srgb,var(--warning)_20%,transparent)] text-[var(--foreground)]',
        danger:
          'border-transparent bg-[color-mix(in_srgb,var(--destructive)_18%,transparent)] text-[var(--destructive)]',
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
