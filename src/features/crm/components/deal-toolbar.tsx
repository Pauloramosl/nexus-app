// Caminho do Ficheiro: src/features/crm/components/deal-toolbar.tsx

import { ViewColumnsIcon, TableCellsIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type { DealStage } from '@/features/crm/types';
// REMOVEMOS a importação que estava a causar o erro
import { cn } from '@/lib/utils';

// ADICIONAMOS a configuração dos títulos aqui dentro
const STAGES_CONFIG: Record<DealStage, string> = {
  prospecting: 'Prospecting',
  qualification: 'Qualification',
  proposal: 'Proposta',
  negotiation: 'Negociação',
  won: 'Ganhos',
  lost: 'Perdidos',
};

type DealToolbarProps = {
  view: 'kanban' | 'list';
  onChangeView: (view: 'kanban' | 'list') => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  stageFilter: DealStage | 'all';
  onStageFilterChange: (stage: DealStage | 'all') => void;
};

export function DealToolbar({
  view,
  onChangeView,
  searchTerm,
  onSearchTermChange,
  stageFilter,
  onStageFilterChange,
}: DealToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative flex-1">
          <FunnelIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            type="search"
            placeholder="Buscar por negócio, cliente ou owner..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-600"
          />
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {/* USAMOS a nossa configuração local */}
          {(['all', ...Object.keys(STAGES_CONFIG)] as Array<DealStage | 'all'>).map(
            (stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => onStageFilterChange(stage)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold transition',
                  stageFilter === stage
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
                )}
              >
                {stage === 'all' ? 'Todos' : STAGES_CONFIG[stage]}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 md:w-auto">
        <div className="flex items-center gap-2 md:hidden">
          <select
            value={stageFilter}
            onChange={(event) =>
              onStageFilterChange(event.target.value as DealStage | 'all')
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">Todos</option>
            {/* USAMOS a nossa configuração local */}
            {Object.entries(STAGES_CONFIG).map(([stageKey, title]) => (
              <option key={stageKey} value={stageKey}>
                {title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => onChangeView('kanban')}
            className={cn(
              'rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 transition hover:text-primary-600',
              view === 'kanban' &&
                'bg-white text-primary-600 shadow-sm dark:bg-slate-900 dark:text-primary-200',
            )}
          >
            <ViewColumnsIcon className="mx-auto mb-1 h-4 w-4" />
            Kanban
          </button>
          <button
            type="button"
            onClick={() => onChangeView('list')}
            className={cn(
              'rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 transition hover:text-primary-600',
              view === 'list' &&
                'bg-white text-primary-600 shadow-sm dark:bg-slate-900 dark:text-primary-200',
            )}
          >
            <TableCellsIcon className="mx-auto mb-1 h-4 w-4" />
            Lista
          </button>
        </div>
      </div>
    </div>
  );
}