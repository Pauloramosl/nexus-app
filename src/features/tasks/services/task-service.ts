import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { firestore, isFirebaseConfigured } from '@/lib/firebase';
import type { Project, ProjectStatus, Task, TaskPriority, TaskStatus } from '@/features/tasks/types';
import { mockProjects, mockTasks } from '@/features/tasks/data/mock-data';

export type TasksDataPayload = {
  tasks: Task[];
  projects: Project[];
  source: 'firestore' | 'mock';
};

const TASKS_COLLECTION = 'tasks';
const PROJECTS_COLLECTION = 'projects';

export async function fetchTasksData(): Promise<TasksDataPayload> {
  if (!isFirebaseConfigured || !firestore) {
    return {
      tasks: mockTasks,
      projects: mockProjects,
      source: 'mock',
    };
  }

  try {
    const db = firestore;
    if (!db) {
      throw new Error('Firestore não disponível.');
    }

    const [taskSnapshot, projectSnapshot] = await Promise.all([
      getDocs(collection(db, TASKS_COLLECTION)),
      getDocs(collection(db, PROJECTS_COLLECTION)),
    ]);

    const tasks = taskSnapshot.docs.map((snapshot) =>
      normalizeTask(snapshot.data(), snapshot.id),
    );

    const projects = projectSnapshot.docs.map((snapshot) =>
      normalizeProject(snapshot.data(), snapshot.id),
    );

    return {
      tasks: tasks.length > 0 ? tasks : mockTasks,
      projects: projects.length > 0 ? projects : mockProjects,
      source: tasks.length > 0 || projects.length > 0 ? 'firestore' : 'mock',
    };
  } catch (error) {
    console.warn(
      '[TaskService] Erro ao carregar dados do Firestore, usando mocks.',
      error,
    );

    return {
      tasks: mockTasks,
      projects: mockProjects,
      source: 'mock',
    };
  }
}

export async function updateTaskStatusRemote(
  taskId: string,
  status: TaskStatus,
) {
  if (!isFirebaseConfigured || !firestore) {
    return;
  }

  try {
    const db = firestore;
    if (!db) {
      return;
    }
    const reference = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(reference, { status });
  } catch (error) {
    console.warn('[TaskService] Falha ao atualizar status no Firestore', error);
  }
}

export async function updateTaskChecklistRemote(
  taskId: string,
  checklist: Task['checklist'],
) {
  if (!isFirebaseConfigured || !firestore) {
    return;
  }

  try {
    const db = firestore;
    if (!db) {
      return;
    }
    const reference = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(reference, { checklist });
  } catch (error) {
    console.warn(
      '[TaskService] Falha ao atualizar checklist no Firestore',
      error,
    );
  }
}

export async function updateTaskDueDateRemote(
  taskId: string,
  dueDate: string,
) {
  if (!isFirebaseConfigured || !firestore) {
    return;
  }

  try {
    const db = firestore;
    if (!db) {
      return;
    }
    const reference = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(reference, { dueDate });
  } catch (error) {
    console.warn(
      '[TaskService] Falha ao atualizar data no Firestore',
      error,
    );
  }
}

export function subscribeToTasksData(
  onData: (payload: TasksDataPayload) => void,
  onError: (error: Error) => void,
) {
  if (!isFirebaseConfigured || !firestore) {
    onData({
      tasks: mockTasks,
      projects: mockProjects,
      source: 'mock',
    });

    return () => {};
  }

  let latestTasks: Task[] = [];
  let latestProjects: Project[] = [];

  const emit = () => {
    onData({
      tasks: latestTasks,
      projects: latestProjects,
      source: 'firestore',
    });
  };

  const db = firestore;
  if (!db) {
    onError(new Error('Firestore não disponível.'));
    return () => {};
  }

  const tasksUnsubscribe = onSnapshot(
    collection(db, TASKS_COLLECTION),
    (snapshot) => {
      latestTasks = snapshot.docs.map((docSnapshot) =>
        normalizeTask(docSnapshot.data(), docSnapshot.id),
      );
      emit();
    },
    (error) => onError(normalizeError(error)),
  );

  const projectsUnsubscribe = onSnapshot(
    collection(db, PROJECTS_COLLECTION),
    (snapshot) => {
      latestProjects = snapshot.docs.map((docSnapshot) =>
        normalizeProject(docSnapshot.data(), docSnapshot.id),
      );
      emit();
    },
    (error) => onError(normalizeError(error)),
  );

  return () => {
    tasksUnsubscribe();
    projectsUnsubscribe();
  };
}

function normalizeTask(data: unknown, id: string): Task {
  const record = asRecord(data);

  const status = normalizeEnum<TaskStatus>(
    record.status,
    ['todo', 'in_progress', 'review', 'done'],
    'todo',
  );

  const priority = normalizeEnum<TaskPriority>(
    record.priority,
    ['low', 'medium', 'high'],
    'medium',
  );

  const checklist = Array.isArray(record.checklist)
    ? record.checklist
        .map((item) => asRecord(item))
        .map((item) => ({
          label: String(item.label ?? 'Item'),
          completed: Boolean(item.completed),
        }))
    : [];

  return {
    id,
    title: String(record.title ?? 'Sem título'),
    description: String(record.description ?? ''),
    projectId: String(record.projectId ?? ''),
    owner: String(record.owner ?? 'Equipe'),
    dueDate: String(
      record.dueDate ?? new Date().toISOString().split('T')[0],
    ),
    status,
    priority,
    tags: Array.isArray(record.tags)
      ? record.tags.map((tag) => String(tag))
      : [],
    checklist,
  };
}

function normalizeProject(data: unknown, id: string): Project {
  const record = asRecord(data);

  const status = normalizeEnum<ProjectStatus>(
    record.status,
    ['planning', 'active', 'paused', 'delivered'],
    'planning',
  );

  return {
    id,
    name: String(record.name ?? 'Projeto'),
    description: String(record.description ?? ''),
    status,
    dueDate: String(record.dueDate ?? ''),
    progress: Number.isFinite(record.progress)
      ? Number(record.progress)
      : 0,
    client: String(record.client ?? ''),
    owner: String(record.owner ?? ''),
    color: String(record.color ?? '#2563eb'),
    team: Array.isArray(record.team)
      ? record.team.map((member) => {
          const value = asRecord(member);
          return {
            name: String(value.name ?? 'Membro'),
            role: String(value.role ?? 'Função'),
          };
        })
      : [],
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function normalizeEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error('Ocorreu um erro ao sincronizar dados de tarefas.');
}
