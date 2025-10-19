import { useEffect, useMemo, useState } from 'react';
import { TaskCalendar } from '@/features/tasks/components/task-calendar';
import { TaskCalendarFilters } from '@/features/tasks/components/task-calendar-filters';
import { TaskDetailsDialog } from '@/features/tasks/components/task-details-dialog';
import { useTasksStore } from '@/features/tasks/stores/tasks-store';
import type { Task } from '@/features/tasks/types';
import { Spinner } from '@/components/ui/spinner';

export function CalendarPage() {
  const {
    tasks,
    projects,
    loading,
    error,
    init,
    updateTaskStatus,
    toggleChecklistItem,
    updateTaskDueDate,
  } = useTasksStore((state) => ({
    tasks: state.tasks,
    projects: state.projects,
    loading: state.loading,
    error: state.error,
    init: state.init,
    updateTaskStatus: state.updateTaskStatus,
    toggleChecklistItem: state.toggleChecklistItem,
    updateTaskDueDate: state.updateTaskDueDate,
  }));

  const [filters, setFilters] = useState<{ owner: string; projectId: string }>({
    owner: 'all',
    projectId: 'all',
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    void init();
  }, [init]);

  const ownersOptions = useMemo(() => {
    const uniqueOwners = new Set<string>();
    tasks.forEach((task) => uniqueOwners.add(task.owner));
    return Array.from(uniqueOwners)
      .sort((a, b) => a.localeCompare(b, 'pt-BR'))
      .map((owner) => ({ label: owner, value: owner }));
  }, [tasks]);

  const projectOptions = useMemo(
    () =>
      projects
        .map((project) => ({ label: project.name, value: project.id }))
        .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR')),
    [projects],
  );

  const projectsById = useMemo(
    () =>
      projects.reduce<Record<string, (typeof projects)[number]>>((map, project) => {
        map[project.id] = project;
        return map;
      }, {}),
    [projects],
  );

  const filteredTasks = useMemo(() => {
    const { owner, projectId } = filters;
    return tasks.filter((task) => {
      const matchesOwner = owner === 'all' || task.owner === owner;
      const matchesProject = projectId === 'all' || task.projectId === projectId;
      return matchesOwner && matchesProject;
    });
  }, [filters, tasks]);

  const sortedTasks = useMemo(
    () =>
      [...filteredTasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [filteredTasks],
  );

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

      <TaskCalendarFilters
        owners={ownersOptions}
        projects={projectOptions}
        value={filters}
        onChange={setFilters}
      />

      <TaskCalendar
        tasks={sortedTasks}
        onSelectTask={setSelectedTask}
        onMoveTask={updateTaskDueDate}
      />

      <TaskDetailsDialog
        open={selectedTask !== null}
        task={selectedTask}
        project={selectedTask ? projectsById[selectedTask.projectId] : undefined}
        onClose={() => setSelectedTask(null)}
        onChangeStatus={updateTaskStatus}
        onToggleChecklist={toggleChecklistItem}
      />
    </div>
  );
}
