export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
}

export type FilterStatus = 'all' | 'completed' | 'active';

export interface PendingDeletion {
  taskId: number;
  taskTitle: string;
  expiresAt: number;
  duration: number;
}

export interface TaskState {
  tasks: Task[];
  pendingDeletions: PendingDeletion[];
  lastDeletedTask: Task | null;
}

export type TaskAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'completed'> }
  | { type: 'TOGGLE_TASK'; payload: number }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'REQUEST_DELETE'; payload: { taskId: number; expiresAt: number; duration: number } }
  | { type: 'CONFIRM_DELETE'; payload: number }
  | { type: 'UNDO_DELETE'; payload: number }
  | { type: 'RESTORE_LAST_DELETED' }
  | { type: 'RESET_TASKS'; payload: Task[] };

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error' | 'warning';
  duration?: number;
  undoTaskId?: number;
  expiresAt?: number;
}

export interface TaskContextValue {
  tasks: Task[];
  filteredTasks: Task[];
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  stats: { total: number; completed: number; active: number };
  pendingDeletions: PendingDeletion[];
  lastDeletedTask: Task | null;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  addTask: (taskData: Omit<Task, 'id' | 'completed'>) => void;
  updateTask: (task: Task) => void;
  toggleTask: (id: number) => void;
  requestDelete: (id: number) => void;
  undoDelete: (id: number) => void;
  restoreLastDeleted: () => void;
  resetTasks: () => void;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
}