import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-500 focus:ring-primary-200 dark:bg-primary-500 dark:text-white dark:hover:bg-primary-400 dark:focus:ring-primary-700',
  secondary:
    'bg-slate-900 text-white hover:bg-slate-700 focus:ring-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:focus:ring-slate-600',
  outline:
    'border border-slate-200 bg-transparent text-slate-900 hover:bg-slate-100 focus:ring-primary-200 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus:ring-primary-700',
  ghost:
    'bg-transparent text-slate-900 hover:bg-slate-100 focus:ring-primary-200 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus:ring-primary-700',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-offset-slate-950',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent dark:border-slate-100/70" />
      )}
      {children}
    </button>
  ),
);

Button.displayName = 'Button';
