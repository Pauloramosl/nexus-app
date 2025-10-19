import { Fragment, type ComponentType } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import type { Project, Task, TaskStatus } from '@/features/tasks/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatRelativeDate } from '@/lib/utils';

type TaskDetailsDialogProps = {
  open: boolean;
  task: Task | null;
  project: Project | undefined;
  onClose: () => void;
  onChangeStatus: (taskId: string, status: TaskStatus) => void;
  onToggleChecklist: (taskId: string, label: string) => void;
};

export function TaskDetailsDialog({
  open,
  task,
  project,
  onClose,
  onChangeStatus,
  onToggleChecklist,
}: TaskDetailsDialogProps) {
  if (!task) {
    return null;
  }

  const statusLabels: Record<TaskStatus, string> = {
    todo: 'A Fazer',
    in_progress: 'Em andamento',
    review: 'Revisão',
    done: 'Concluído',
  };

  const priorityLabels: Record<Task['priority'], string> = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
  };

  const statusActions: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-xl transition-all dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-start justify-between">
                  <div>
                    <Dialog.Title className="text-2xl font-semibold text-slate-900 dark:text-white">
                      {task.title}
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {task.description}
                    </p>
                  </div>
                  <Button variant="ghost" onClick={onClose}>
                    Fechar
                  </Button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <InfoRow
                    icon={CalendarDaysIcon}
                    label="Entrega"
                    value={formatRelativeDate(task.dueDate)}
                  />
                  <InfoRow
                    icon={ClockIcon}
                    label="Status"
                    value={statusLabels[task.status]}
                  />
                  <InfoRow
                    icon={TagIcon}
                    label="Prioridade"
                    value={priorityLabels[task.priority]}
                  />
                  <InfoRow
                    icon={CheckCircleIcon}
                    label="Projeto"
                    value={project?.name ?? 'Projeto não encontrado'}
                  />
                </div>

                {task.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <section className="mt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                    Checklist
                  </h3>
                  <div className="mt-3 space-y-2">
                    {task.checklist.map((item) => (
                      <label
                        key={item.label}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
                          item.completed && 'border-emerald-200 dark:border-emerald-500/40',
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => onToggleChecklist(task.id, item.label)}
                          className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span
                          className={cn(
                            'flex-1',
                            item.completed && 'line-through opacity-70',
                          )}
                        >
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>

                <section className="mt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                    Atualizar status
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {statusActions.map((status) => (
                      <Button
                        key={status}
                        variant={task.status === status ? 'primary' : 'outline'}
                        className={cn(
                          'rounded-full px-4 py-2 text-xs font-semibold',
                          task.status === status &&
                            'bg-primary-600 text-white dark:bg-primary-500',
                        )}
                        onClick={() => onChangeStatus(task.id, status)}
                      >
                        {statusLabels[status]}
                      </Button>
                    ))}
                  </div>
                </section>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

type InfoRowProps = {
  icon: ComponentType<React.ComponentProps<'svg'>>;
  label: string;
  value: string;
};

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      <Icon className="h-4 w-4" />
      <div>
        <p className="font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
          {label}
        </p>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{value}</p>
      </div>
    </div>
  );
}
