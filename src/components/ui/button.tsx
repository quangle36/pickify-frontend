import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { LoaderCircle } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'relative inline-flex max-w-full items-center justify-center gap-2 rounded-xl border border-transparent text-center text-sm font-medium leading-tight [overflow-wrap:anywhere] outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 aria-busy:cursor-progress select-none',
  {
    variants: {
      variant: {
        default: 'bg-stone-900 text-white hover:bg-stone-800',
        destructive: 'bg-rose-50 text-rose-700 hover:bg-rose-100',
        outline: 'border-stone-300 bg-white text-stone-800 hover:bg-stone-100',
        secondary: 'bg-stone-100 text-stone-900 hover:bg-stone-200',
        ghost: 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
        link: 'text-stone-900 underline-offset-4 hover:underline',
        brand: 'bg-brand-600 text-white hover:bg-brand-700',
        dark: 'bg-stone-900 text-white hover:bg-stone-800',
      },
      size: {
        default: 'min-h-10 px-4 py-2',
        sm: 'min-h-8 sm:min-h-9 rounded-lg px-3 sm:px-3.5 text-xs',
        lg: 'min-h-11 sm:min-h-12 rounded-xl px-6 text-base',
        icon: 'h-9 w-9 rounded-xl',
        'icon-sm': 'h-8 w-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, onClick, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        disabled={isLoading ? false : disabled}
        aria-busy={isLoading || props['aria-busy'] || undefined}
        aria-disabled={isLoading || props['aria-disabled'] || undefined}
        onClick={(event) => {
          if (isLoading) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
      >
        {isLoading && !asChild ? (
          <>
            <span className="invisible inline-flex items-center justify-center gap-2">{children}</span>
            <LoaderCircle className="absolute h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            <span className="sr-only" role="status">Đang xử lý</span>
          </>
        ) : children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
