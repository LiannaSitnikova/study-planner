import { createContext, useContext } from 'react';
import type { TaskContextValue } from '../types/task';

export const TaskContext = createContext<TaskContextValue | null>(null);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext повинен використовуватися всередині <TaskProvider>');
  }
  return context;
};