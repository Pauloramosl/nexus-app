import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, Task, TaskStatus } from '@/features/tasks/types';
import {
  fetchTasksData,
  updateTaskChecklistRemote,
  updateTaskDueDateRemote,
  updateTaskStatusRemote,
} from '@/features/tasks/services/task-service';
import { mockProjects, mockTasks } from '@/features/tasks/data/mock-data';
import { isFirebaseConfigured } from '@/lib/firebase';

type TasksState = {
  tasks: Task[];
  projects: Project[];
  loading: boolean;
  initialized: boolean;
  error?: string;
  init: () => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  toggleChecklistItem: (taskId: string, label: string) => void;
  updateTaskDueDate: (taskId: string, dueDate: string) => void;
};

const persistOptions = {
  name: 'nexus-tasks',
  partialize: (state: TasksState) => ({
    tasks: state.tasks,
    projects: state.projects,
  }),
};

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: mockTasks,
      projects: mockProjects,
      loading: false,
      initialized: !isFirebaseConfigured,
      error: isFirebaseConfigured
        ? undefined
        : 'Firebase não configurado. Utilizando dados mockados.',
      init: async () => {
        if (!isFirebaseConfigured) {
          return;
        }

        const { loading, initialized } = get();
        if (loading || initialized) {
          return;
        }

        set({ loading: true, error: undefined });

        try {
          const payload = await fetchTasksData();
          set({
            tasks: payload.tasks,
            projects: payload.projects,
            loading: false,
            initialized: true,
            error: undefined,
          });
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar dados de tarefas.';

          console.warn('[TasksStore] Falha ao carregar dados iniciais', error);
          set({
            tasks: mockTasks,
            projects: mockProjects,
            loading: false,
            initialized: true,
            error: message,
          });
        }
      },
      updateTaskStatus: (taskId, status) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, status } : task,
          ),
        }));

        if (isFirebaseConfigured) {
          void updateTaskStatusRemote(taskId, status);
        }
      },
      toggleChecklistItem: (taskId, label) => {
        let updatedChecklist: Task['checklist'] | undefined;

        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) {
              return task;
            }

            updatedChecklist = task.checklist.map((item) =>
              item.label === label
                ? { ...item, completed: !item.completed }
                : item,
            );

            return {
              ...task,
              checklist: updatedChecklist,
            };
          }),
        }));

        if (isFirebaseConfigured && updatedChecklist) {
          void updateTaskChecklistRemote(taskId, updatedChecklist);
        }
      },
      updateTaskDueDate: (taskId, dueDate) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, dueDate } : task,
          ),
        }));

        if (isFirebaseConfigured) {
          void updateTaskDueDateRemote(taskId, dueDate);
        }
      },
    }),
    persistOptions,
  ),
);
