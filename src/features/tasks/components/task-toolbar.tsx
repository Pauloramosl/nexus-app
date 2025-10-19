import { FunnelIcon } from '@heroicons/react/24/outline';
import type { TaskPriority, TaskStatus } from '@/features/tasks/types';
import { cn } from '@/lib/utils';

type TaskToolbarProps = {
  statusFilter: TaskStatus | 'all';
  onStatusFilterChange: (status: TaskStatus | 'all') => void;
  priorityFilter: TaskPriority | 'all';
  onPriorityFilterChange: (priority: TaskPriority | 'all') => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
};

const statusLabels: Record<TaskStatus, string> = {
  todo: 'A Fazer',
  in_progress: 'Em andamento',
  review: 'Revisão',
  done: 'Concluído',
};

const priorityLabels: Record<TaskPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

export function TaskToolbar({
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  searchTerm,
  onSearchTermChange,
}: TaskToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative flex-1">
          <FunnelIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Buscar por tarefa, projeto ou responsável..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-600"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span>Status:</span>
          <div className="flex flex-wrap gap-2">
            {(['all', 'todo', 'in_progress', 'review', 'done'] as const).map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onStatusFilterChange(status)}
                  className={cn(
                    'rounded-full px-3 py-1 font-semibold transition',
                    statusFilter === status
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-200'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
                  )}
                >
                  {status === 'all' ? 'Todos' : statusLabels[status]}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span>Prioridade:</span>
          <div className="flex gap-2">
            {(['all', 'low', 'medium', 'high'] as const).map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => onPriorityFilterChange(priority)}
                className={cn(
                  'rounded-full px-3 py-1 font-semibold transition',
                  priorityFilter === priority
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
                )}
              >
                {priority === 'all' ? 'Todas' : priorityLabels[priority]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
