import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          'border border-transparent bg-[var(--button-bg)] text-[var(--button-fg)] hover:bg-[var(--button-hover)] active:bg-[var(--button-active)]',
        destructive:
          'border border-[var(--button-danger-border)] bg-transparent text-[var(--button-danger-fg)] hover:bg-[var(--button-danger-hover)]',
        outline:
          'border border-[var(--button-secondary-border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-fg)] hover:bg-[var(--button-secondary-hover)]',
        secondary:
          'border border-[var(--button-secondary-border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-fg)] hover:bg-[var(--button-secondary-hover)]',
        ghost:
          'text-[var(--button-ghost-fg)] hover:bg-[var(--button-ghost-hover)] hover:text-foreground',
        link: 'text-[var(--ring)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 text-[15px]',
        sm: 'h-9 rounded-md px-3 text-sm',
        lg: 'h-11 rounded-md px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, type = 'button', ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      type={asChild ? undefined : type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
