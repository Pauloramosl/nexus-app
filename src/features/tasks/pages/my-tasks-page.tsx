import { useEffect, useMemo, useState } from 'react';
import { TaskToolbar } from '@/features/tasks/components/task-toolbar';
import { TaskList } from '@/features/tasks/components/task-list';
import { useTasksStore } from '@/features/tasks/stores/tasks-store';
import type { TaskPriority, TaskStatus } from '@/features/tasks/types';
import { useAuth } from '@/providers/auth-provider';
import { Spinner } from '@/components/ui/spinner';

export function MyTasksPage() {
  const { user } = useAuth();
  const {
    tasks,
    projects,
    loading,
    error,
    init,
    updateTaskStatus,
    toggleChecklistItem,
  } = useTasksStore((state) => ({
    tasks: state.tasks,
    projects: state.projects,
    loading: state.loading,
    error: state.error,
    init: state.init,
    updateTaskStatus: state.updateTaskStatus,
    toggleChecklistItem: state.toggleChecklistItem,
  }));

  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    void init();
  }, [init]);

  const ownerName = useMemo(() => {
    if (user?.displayName) {
      return user.displayName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Mariana Lopes';
  }, [user]);

  const projectsById = useMemo(
    () =>
      projects.reduce<Record<string, (typeof projects)[number]>>((map, project) => {
        map[project.id] = project;
        return map;
      }, {}),
    [projects],
  );

  const myTasks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesOwner = task.owner.toLowerCase().includes(ownerName.toLowerCase());
      if (!matchesOwner) {
        return false;
      }

      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === 'all' || task.priority === priorityFilter;

      const projectName = projectsById[task.projectId]?.name.toLowerCase() ?? '';

      const matchesSearch =
        term.length === 0 ||
        task.title.toLowerCase().includes(term) ||
        projectName.includes(term) ||
        task.tags.some((tag) => tag.toLowerCase().includes(term));

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, ownerName, statusFilter, priorityFilter, searchTerm, projectsById]);

  const stats = useMemo(() => {
    const total = myTasks.length;
    const completed = myTasks.filter((task) => task.status === 'done').length;
    const inProgress = myTasks.filter((task) => task.status === 'in_progress').length;
    const highPriority = myTasks.filter((task) => task.priority === 'high').length;

    return { total, completed, inProgress, highPriority };
  }, [myTasks]);

  if (loading && tasks.length === 0) {
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
        <TaskStat
          title="Tarefas totais"
          value={String(stats.total)}
          helpText="Todas atribuídas a você"
        />
        <TaskStat
          title="Concluídas"
          value={String(stats.completed)}
          helpText="Entregues recentemente"
        />
        <TaskStat
          title="Em andamento"
          value={String(stats.inProgress)}
          helpText="Atividades em execução"
        />
        <TaskStat
          title="Prioridades altas"
          value={String(stats.highPriority)}
          helpText="Demandam atenção imediata"
        />
      </section>

      <TaskToolbar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />

      <TaskList
        tasks={myTasks}
        projectsById={projectsById}
        onStatusChange={updateTaskStatus}
        onToggleChecklist={toggleChecklistItem}
      />
    </div>
  );
}

type TaskStatProps = {
  title: string;
  value: string;
  helpText: string;
};

function TaskStat({ title, value, helpText }: TaskStatProps) {
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
