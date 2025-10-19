import { Fragment, useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { navigationItems } from '@/data/navigation';
import { cn } from '@/lib/utils';

type SidebarProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileToggle: () => void;
};

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileToggle,
}: SidebarProps) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const activeParents = navigationItems
      .filter((item) =>
        item.children?.some((child) =>
          child.to ? location.pathname.startsWith(child.to) : false,
        ),
      )
      .map((item) => item.label);

    return new Set(activeParents);
  });

  useEffect(() => {
    const activeParents = navigationItems
      .filter((item) =>
        item.children?.some((child) =>
          child.to ? location.pathname.startsWith(child.to) : false,
        ),
      )
      .map((item) => item.label);

    if (activeParents.length === 0) {
      return;
    }

    setOpenGroups((prev) => {
      const next = new Set(prev);
      let hasChanged = false;

      activeParents.forEach((label) => {
        if (!next.has(label)) {
          next.add(label);
          hasChanged = true;
        }
      });

      return hasChanged ? next : prev;
    });
  }, [location.pathname]);

  const sidebarContent = useMemo(
    () => (
      <aside
        className={cn(
          'flex h-full flex-col border-r border-slate-200 bg-white transition-[width] duration-300 dark:border-slate-800 dark:bg-slate-950',
          collapsed ? 'w-20' : 'w-72',
        )}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-5">
          <div
            className={cn(
              'flex items-center gap-3 text-primary-600 dark:text-primary-300',
              collapsed && 'justify-center',
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-lg font-semibold text-white shadow-lg">
              NX
            </div>
            {!collapsed && (
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  NEXUS
                </p>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Management
                </h2>
              </div>
            )}
          </div>

          <button
            type="button"
            className="hidden rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:block"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-2 py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isOpen = openGroups.has(item.label);
            const hasChildren = Boolean(item.children?.length);

            if (hasChildren) {
              return (
                <div key={item.label} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      const newSet = new Set(openGroups);
                      if (isOpen) {
                        newSet.delete(item.label);
                      } else {
                        newSet.add(item.label);
                      }
                      setOpenGroups(newSet);
                    }}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
                      collapsed && 'justify-center px-0',
                    )}
                    aria-expanded={isOpen}
                    aria-controls={`group-${item.label}`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        <ChevronDownIcon
                          className={cn(
                            'h-4 w-4 transition-transform',
                            isOpen ? 'rotate-180' : '',
                          )}
                        />
                      </>
                    )}
                  </button>

                  {!collapsed && isOpen && (
                    <div
                      id={`group-${item.label}`}
                      className="ml-3 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-700"
                    >
                      {item.children?.map((child) => {
                        const ChildIcon = child.icon;

                        return (
                          <NavLink
                            key={child.label}
                            to={child.to ?? '#'}
                            className={({ isActive }) =>
                              cn(
                                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-primary-50 hover:text-primary-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-primary-300',
                                isActive &&
                                  'bg-primary-100 text-primary-700 shadow-sm dark:bg-primary-500/20 dark:text-primary-200',
                              )
                            }
                            onClick={() => mobileOpen && onMobileToggle()}
                          >
                            <ChildIcon className="h-4 w-4" />
                            <span>{child.label}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.to ?? '#'}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-primary-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-200',
                    collapsed && 'justify-center px-0',
                    isActive &&
                      'bg-primary-100 text-primary-700 shadow-sm dark:bg-primary-500/20 dark:text-primary-200',
                  )
                }
                onClick={() => mobileOpen && onMobileToggle()}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="flex-1">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-600 dark:bg-primary-500/20 dark:text-primary-200">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="rounded-2xl bg-primary-50 p-4 text-xs text-primary-700 dark:bg-primary-500/10 dark:text-primary-200">
            <p className="font-semibold">Próximos passos</p>
            <p className="mt-1">
              Conecte o Google Calendar e configure integrações avançadas no
              módulo CRM.
            </p>
          </div>
        </div>
      </aside>
    ),
    [collapsed, mobileOpen, onMobileToggle, onToggleCollapse, openGroups],
  );

  return (
    <Fragment>
      {/* Desktop */}
      <div className="hidden h-full lg:block">{sidebarContent}</div>

      {/* Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="h-full w-80 border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between px-4 py-4">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                Navegação
              </p>
              <button
                type="button"
                onClick={onMobileToggle}
                className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Fechar menu"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
          <div
            aria-hidden="true"
            className="flex-1 bg-slate-900/40 backdrop-blur-sm"
            onClick={onMobileToggle}
          />
        </div>
      )}
    </Fragment>
  );
}
