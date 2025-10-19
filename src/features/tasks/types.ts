export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  description: string;
  projectId: string;
  owner: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  checklist: { label: string; completed: boolean }[];
};

export type ProjectStatus = 'planning' | 'active' | 'paused' | 'delivered';

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  dueDate: string;
  progress: number;
  client: string;
  owner: string;
  team: { name: string; role: string }[];
  color: string;
};
