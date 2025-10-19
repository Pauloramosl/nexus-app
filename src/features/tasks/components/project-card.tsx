import { CalendarDaysIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import type { Project } from '@/features/tasks/types';
import { Badge } from '@/components/ui/badge';
import { formatRelativeDate, cn } from '@/lib/utils';

const statusLabels: Record<
  Project['status'],
  { label: string; variant: 'outline' | 'success' | 'warning' }
> = {
  planning: { label: 'Planejamento', variant: 'outline' },
  active: { label: 'Em andamento', variant: 'success' },
  paused: { label: 'Em pausa', variant: 'warning' },
  delivered: { label: 'Entregue', variant: 'success' },
};

type ProjectCardProps = {
  project: Project;
  totalTasks?: number;
  doneTasks?: number;
};

export function ProjectCard({ project, totalTasks = 0, doneTasks = 0 }: ProjectCardProps) {
  const status = statusLabels[project.status];

  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {project.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {project.client}
          </p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </header>

      <p className="text-sm text-slate-600 dark:text-slate-300">
        {project.description}
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Progresso</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {typeof totalTasks === 'number' && totalTasks > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Tarefas concluídas</span>
          <span>{doneTasks - 0}/{totalTasks}</span>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <CalendarDaysIcon className="h-4 w-4" />
          <span>Entrega {formatRelativeDate(project.dueDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <UserGroupIcon className="h-4 w-4" />
          <span>{project.team.length} pessoas</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {project.team.map((member) => (
          <span
            key={member.name}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm',
              'bg-slate-800/80',
            )}
          >
            {member.name} - {member.role}
          </span>
        ))}
      </div>
    </article>
  );
}





