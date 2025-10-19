import { cn } from '@/lib/utils';

type SpinnerProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeMap: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-primary-500 border-t-transparent dark:border-primary-400',
        sizeMap[size],
        className,
      )}
      aria-label="Carregando..."
    />
  );
}
