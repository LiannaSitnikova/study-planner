import type { Task } from '../types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  onRetry: () => void;
  onToggleTask: (task: Task) => void;
  onDeleteTask: (id: number) => Promise<void>;
}

export const TaskList = ({
  tasks,
  isLoading,
  error,
  isAuthenticated,
  onRetry,
  onToggleTask,
  onDeleteTask,
}: TaskListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="inline-block w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-gray-600 font-medium">Завантаження завдань...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 px-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 font-medium mb-3">Помилка завантаження: {error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
        >
          Спробувати ще
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 font-medium">Завдань за обраними фільтрами не знайдено.</p>
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isAuthenticated={isAuthenticated}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
};