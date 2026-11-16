import type { Task, TaskAction, TaskState } from '../types/task';
import { initialTasks } from '../data/initialTasks';

export const TASKS_STORAGE_KEY = 'study-planner-tasks-v1';

export const loadInitialTaskState = (): TaskState => {
  try {
    const raw = window.localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) {
      return {
        tasks: initialTasks,
        pendingDeletions: [],
        lastDeletedTask: null,
      };
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return {
        tasks: parsed,
        pendingDeletions: [],
        lastDeletedTask: null,
      };
    }
  } catch (error) {
    console.error('Помилка читання tasks з localStorage:', error);
  }

  return {
    tasks: initialTasks,
    pendingDeletions: [],
    lastDeletedTask: null,
  };
};

export const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask: Task = {
        ...action.payload,
        id: Date.now(),
        completed: false,
      };
      return {
        ...state,
        tasks: [newTask, ...state.tasks],
      };
    }

    case 'TOGGLE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        ),
      };
    }

    case 'UPDATE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    }

    case 'REQUEST_DELETE': {
      const { taskId, expiresAt, duration } = action.payload;
      const targetTask = state.tasks.find((t) => t.id === taskId);
      if (!targetTask) return state;

     if (state.pendingDeletions.some((p) => p.taskId === taskId)) {
        return state;
      }

      return {
        ...state,
        pendingDeletions: [
          ...state.pendingDeletions,
          {
            taskId,
            taskTitle: targetTask.title,
            expiresAt,
            duration,
          },
        ],
      };
    }

    case 'CONFIRM_DELETE': {
      const taskId = action.payload;
      const deletedTask = state.tasks.find((t) => t.id === taskId) || null;

      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== taskId),
        pendingDeletions: state.pendingDeletions.filter((p) => p.taskId !== taskId),
        lastDeletedTask: deletedTask ?? state.lastDeletedTask,
      };
    }

    case 'UNDO_DELETE': {
      const taskId = action.payload;
      return {
        ...state,
        pendingDeletions: state.pendingDeletions.filter((p) => p.taskId !== taskId),
      };
    }

    case 'RESTORE_LAST_DELETED': {
      if (!state.lastDeletedTask) return state;

      const exists = state.tasks.some((t) => t.id === state.lastDeletedTask!.id);
      const taskToRestore: Task = exists
        ? { ...state.lastDeletedTask, id: Date.now() }
        : state.lastDeletedTask;

      return {
        ...state,
        tasks: [taskToRestore, ...state.tasks],
        lastDeletedTask: null,
      };
    }

    case 'RESET_TASKS': {
      return {
        tasks: action.payload,
        pendingDeletions: [],
        lastDeletedTask: null,
      };
    }

    default:
      return state;
  }
};