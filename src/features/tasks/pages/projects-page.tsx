import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { ProjectCard } from '@/features/tasks/components/project-card';
import { useTasksStore } from '@/features/tasks/stores/tasks-store';
import type { ProjectStatus } from '@/features/tasks/types';
import { Spinner } from '@/components/ui/spinner';

const statusLabels: Record<ProjectStatus, string> = {
  planning: 'Planejamento',
  active: 'Em andamento',
  paused: 'Em pausa',
  delivered: 'Entregue',
};

export function ProjectsPage() {
  const { projects, tasks, loading, error, init } = useTasksStore((state) => ({
    projects: state.projects,
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    init: state.init,
  }));

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');

  useEffect(() => {
    void init();
  }, [init]);

  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((project) => project.status === 'active').length;
    const delivered = projects.filter((project) => project.status === 'delivered').length;
    const planning = projects.filter((project) => project.status === 'planning').length;
    const averageProgress =
      total === 0
        ? 0
        : projects.reduce((sum, project) => sum + project.progress, 0) / total;

    return {
      total,
      active,
      delivered,
      planning,
      averageProgress,
    };
  }, [projects]);

  const tasksByProject = useMemo(() => {
    return tasks.reduce<Record<string, { total: number; done: number }>>(
      (accumulator, task) => {
        const entry = accumulator[task.projectId] ?? { total: 0, done: 0 };
        entry.total += 1;
        if (task.status === 'done') {
          entry.done += 1;
        }
        accumulator[task.projectId] = entry;
        return accumulator;
      },
      {},
    );
  }, [tasks]);

  const filteredProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return projects
      .filter((project) => {
        const matchesStatus =
          statusFilter === 'all' || project.status === statusFilter;

        const matchesTerm =
          term.length === 0 ||
          project.name.toLowerCase().includes(term) ||
          project.client.toLowerCase().includes(term) ||
          project.owner.toLowerCase().includes(term);

        return matchesStatus && matchesTerm;
      })
      .sort(
        (a, b) =>
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      );
  }, [projects, searchTerm, statusFilter]);

  if (loading && projects.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-3xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-4">
        <ProjectStat
          title="Projetos ativos"
          value={String(stats.active)}
          helpText="Em execução neste momento"
        />
        <ProjectStat
          title="Em planejamento"
          value={String(stats.planning)}
          helpText="Entrarão no pipeline em breve"
        />
        <ProjectStat
          title="Entregues"
          value={String(stats.delivered)}
          helpText="Concluídos nas últimas semanas"
        />
        <ProjectStat
          title="Progresso médio"
          value={`${Math.round(stats.averageProgress)}%`}
          helpText={`Sobre ${stats.total} projetos`}
        />
      </section>

      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por projeto, cliente ou responsável..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-600"
          />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {filteredProjects.length} projeto(s) encontrado(s)
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Status
          </span>
          <div className="flex flex-wrap gap-2">
            {(['all', 'planning', 'active', 'paused', 'delivered'] as Array<
              ProjectStatus | 'all'
            >).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'rounded-full px-3 py-1 font-semibold transition',
                  statusFilter === status
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
                )}
              >
                {status === 'all' ? 'Todos' : statusLabels[status]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            totalTasks={tasksByProject[project.id]?.total ?? 0}
            doneTasks={tasksByProject[project.id]?.done ?? 0}
          />
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
            Nenhum projeto encontrado para os filtros selecionados.
          </div>
        )}
      </section>
    </div>
  );
}

type ProjectStatProps = {
  title: string;
  value: string;
  helpText: string;
};

function ProjectStat({ title, value, helpText }: ProjectStatProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600 dark:text-primary-300">
        {title}
      </p>
      <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </h3>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{helpText}</p>
    </div>
  );
}
