import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'outline' | 'success' | 'warning';

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-200',
  outline:
    'border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-200',
  success:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  warning:
    'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
};

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  variant?: BadgeVariant;
};

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
