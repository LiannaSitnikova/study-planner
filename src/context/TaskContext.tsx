import { useReducer, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { FilterStatus, Task, ToastMessage } from '../types/task';
import { loadInitialTaskState, taskReducer, TASKS_STORAGE_KEY } from '../reducers/taskReducer';
import { initialTasks } from '../data/initialTasks';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TaskContext } from '../hooks/useTaskContext';

const UNDO_MS = 5000;

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(taskReducer, undefined, loadInitialTaskState);
  const [filter, setFilter] = useLocalStorage<FilterStatus>('study-planner-filter', 'all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(state.tasks));
  }, [state.tasks]);

  const completed = state.tasks.filter((t) => t.completed).length;
  const stats = { total: state.tasks.length, completed, active: state.tasks.length - completed };
  const filteredTasks = state.tasks.filter((t) =>
    filter === 'completed' ? t.completed : filter === 'active' ? !t.completed : true
  );

  useEffect(() => {
    document.title = `Study Planner • ${stats.active} active tasks`;
  }, [stats.active]);

  useEffect(() => {
    if (state.pendingDeletions.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      state.pendingDeletions.forEach((p) => {
        if (now >= p.expiresAt) {
          dispatch({ type: 'CONFIRM_DELETE', payload: p.taskId });
          setToasts((prev) => prev.filter((t) => t.undoTaskId !== p.taskId));
          showToast({ text: `Завдання «${p.taskTitle}» видалено`, type: 'info', duration: 3000 });
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [state.pendingDeletions, showToast]);

  const addTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    if (!taskData.title.trim()) {
      return showToast({ text: 'Введіть назву завдання', type: 'error', duration: 3000 });
    }
    dispatch({ type: 'ADD_TASK', payload: taskData });
    showToast({ text: `Завдання «${taskData.title}» створено`, type: 'success', duration: 3000 });
  };

  const updateTask = (task: Task) => {
    if (!task.title.trim()) {
      return showToast({ text: 'Назва не може бути порожньою', type: 'error', duration: 3000 });
    }
    dispatch({ type: 'UPDATE_TASK', payload: task });
    setEditingTask(null);
    showToast({ text: `Завдання «${task.title}» оновлено`, type: 'success', duration: 3000 });
  };

  const toggleTask = (id: number) => dispatch({ type: 'TOGGLE_TASK', payload: id });

  const requestDelete = (id: number) => {
    const task = state.tasks.find((t) => t.id === id);
    if (!task || state.pendingDeletions.some((p) => p.taskId === id)) return;
    if (editingTask?.id === id) setEditingTask(null);

    const expiresAt = Date.now() + UNDO_MS;
    dispatch({ type: 'REQUEST_DELETE', payload: { taskId: id, expiresAt, duration: UNDO_MS } });
    showToast({
      text: `Завдання «${task.title}» буде видалено`,
      type: 'warning',
      duration: UNDO_MS,
      undoTaskId: id,
      expiresAt,
    });
  };

  const undoDelete = (id: number) => {
    dispatch({ type: 'UNDO_DELETE', payload: id });
    setToasts((prev) => prev.filter((t) => t.undoTaskId !== id));
    showToast({ text: 'Видалення скасовано', type: 'info', duration: 2500 });
  };

  const restoreLastDeleted = () => {
    if (!state.lastDeletedTask) {
      return showToast({ text: 'Немає видалених завдань', type: 'error', duration: 3000 });
    }
    const title = state.lastDeletedTask.title;
    dispatch({ type: 'RESTORE_LAST_DELETED' });
    showToast({ text: `Відновлено «${title}»`, type: 'success', duration: 3000 });
  };

  const resetTasks = () => {
    dispatch({ type: 'RESET_TASKS', payload: initialTasks });
    setEditingTask(null);
    setToasts([]);
    showToast({ text: 'Дані скинуто до початкових', type: 'info', duration: 3000 });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        filteredTasks,
        filter,
        setFilter,
        stats,
        pendingDeletions: state.pendingDeletions,
        lastDeletedTask: state.lastDeletedTask,
        editingTask,
        setEditingTask,
        addTask,
        updateTask,
        toggleTask,
        requestDelete,
        undoDelete,
        restoreLastDeleted,
        resetTasks,
        toasts,
        dismissToast,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};