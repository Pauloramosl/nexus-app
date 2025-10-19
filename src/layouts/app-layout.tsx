import { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Sidebar } from '@/components/navigation/sidebar';
import { useAuth } from '@/providers/auth-provider';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { navigationItems, type NavItem } from '@/data/navigation';

export function AppLayout() {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useLocalStorage(
    'nexus:sidebar-collapsed',
    false,
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle = useMemo(() => {
    type FlatNavItem = NavItem & { parent?: string };

    const flatItems: FlatNavItem[] = navigationItems.flatMap((item) => {
      if (item.children && item.children.length > 0) {
        return item.children.map((child) => ({
          ...child,
          parent: item.label,
        }));
      }

      return [{ ...item }];
    });

    const current = flatItems.find((item) => {
      if (!item.to) {
        return false;
      }

      if (item.to === '/') {
        return location.pathname === '/';
      }

      return location.pathname.startsWith(item.to);
    });

    return current
      ? { title: current.label, parent: current.parent }
      : { title: 'Visao Geral', parent: undefined };
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onMobileToggle={() => setMobileOpen((prev) => !prev)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex flex-col gap-4 px-4 py-4 md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary-600 dark:text-primary-300">
                  {pageTitle.parent ?? 'NEXUS'}
                </p>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {pageTitle.title}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-3 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800 md:flex">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName ?? user.email ?? 'Usuario'}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-xs font-semibold uppercase text-white">
                      {user?.displayName?.[0]?.toUpperCase() ??
                        user?.email?.[0]?.toUpperCase() ??
                        'N'}
                    </div>
                  )}
                  <div className="hidden text-left text-sm xl:block">
                    <p className="font-medium">
                      {user?.displayName ?? 'Usuario'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <ThemeToggle className="hidden md:flex" />

                <Button
                  variant="outline"
                  onClick={logout}
                  loading={loading}
                  className="hidden border-slate-200 dark:border-slate-700 md:inline-flex"
                >
                  Sair
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Pesquisar clientes, projetos, tarefas..."
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-600"
                />
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Button
                  variant="ghost"
                  className="w-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:bg-primary-500/10 dark:hover:text-primary-200 md:hidden"
                  onClick={() => setMobileOpen(true)}
                >
                  Abrir menu
                </Button>
                <Button
                  variant="primary"
                  className="w-full md:w-auto"
                  size="md"
                >
                  Nova tarefa
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 px-4 py-6 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
