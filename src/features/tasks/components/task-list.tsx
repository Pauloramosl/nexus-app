import {
  CheckCircleIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import type { Project, Task, TaskStatus } from '@/features/tasks/types';
import { Badge } from '@/components/ui/badge';
import { formatRelativeDate, cn } from '@/lib/utils';

const statusMeta: Record<TaskStatus, { label: string; accent: string }> = {
  todo: { label: 'A Fazer', accent: 'border-slate-300' },
  in_progress: { label: 'Em andamento', accent: 'border-amber-400' },
  review: { label: 'Revisão', accent: 'border-sky-400' },
  done: { label: 'Concluído', accent: 'border-emerald-400' },
};

type TaskListProps = {
  tasks: Task[];
  projectsById: Record<string, Project>;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onToggleChecklist: (taskId: string, label: string) => void;
};

export function TaskList({
  tasks,
  projectsById,
  onStatusChange,
  onToggleChecklist,
}: TaskListProps) {
  const groups = (['todo', 'in_progress', 'review', 'done'] as TaskStatus[]).map(
    (status) => ({
      status,
      tasks: tasks.filter((task) => task.status === status),
    }),
  );

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {groups.map(({ status, tasks: statusTasks }) => (
        <section
          key={status}
          className={cn(
            'flex min-h-[320px] flex-col gap-4 rounded-3xl border bg-white p-4 shadow-sm dark:bg-slate-900',
            statusMeta[status].accent,
          )}
        >
          <header className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {statusMeta[status].label}
            </h3>
            <Badge variant="outline">{statusTasks.length}</Badge>
          </header>

          <div className="flex flex-1 flex-col gap-3">
            {statusTasks.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                Nenhuma tarefa neste estágio.
              </div>
            ) : (
              statusTasks.map((task) => (
                <article
                  key={task.id}
                  className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {projectsById[task.projectId]?.name ?? 'Projeto desconhecido'}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="rounded-full border border-slate-200 p-1 text-slate-400 transition hover:border-emerald-300 hover:text-emerald-500 dark:border-slate-700 dark:text-slate-500 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                      onClick={() =>
                        onStatusChange(task.id, status === 'done' ? 'todo' : 'done')
                      }
                      aria-label="Alternar status"
                    >
                      <CheckCircleIcon
                        className={cn('h-5 w-5', status === 'done' && 'text-emerald-500')}
                      />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Prioridade {task.priority}</Badge>
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <CalendarDaysIcon className="h-4 w-4" />
                      <span>Entrega {formatRelativeDate(task.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>
                        {
                          task.checklist.filter((item) => item.completed)
                            .length
                        }
                        /{task.checklist.length}
                      </span>
                      <ChevronRightIcon className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {task.checklist.map((item) => (
                      <label
                        key={item.label}
                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => onToggleChecklist(task.id, item.label)}
                          className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className={item.completed ? 'line-through opacity-70' : ''}>
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
