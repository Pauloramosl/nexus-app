import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/providers/theme-provider';
import { cn } from '@/lib/utils';

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
        className,
      )}
      aria-label="Alternar tema"
    >
      {theme === 'light' ? (
        <>
          <SunIcon className="h-5 w-5" />
          Tema Claro
        </>
      ) : (
        <>
          <MoonIcon className="h-5 w-5" />
          Tema Escuro
        </>
      )}
    </button>
  );
}
