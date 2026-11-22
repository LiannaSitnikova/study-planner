import { useState } from 'react';
import { Link } from 'react-router';
import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  isAuthenticated: boolean;
  onToggleTask: (task: Task) => void;
  onDeleteTask: (id: number) => Promise<void>;
}

export const TaskItem = ({
  task,
  isAuthenticated,
  onToggleTask,
  onDeleteTask,
}: TaskItemProps) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const priorityColors = {
    low: 'bg-gray-200 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteTask(task.id);
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 mb-3 transition-all shadow-xs ${
        task.completed
          ? 'bg-emerald-50/60 border-emerald-300 border-l-4 border-l-emerald-500'
          : 'bg-white border-gray-200 border-l-4 border-l-blue-500'
      }`}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <Link
          to={`/tasks/${task.id}`}
          state={{ task }}
          className={`text-left font-semibold text-lg hover:underline ${
            task.completed ? 'line-through text-gray-400' : 'text-gray-800'
          }`}
        >
          {task.title}
        </Link>

        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className={`text-sm mb-3 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-gray-100 mt-2">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          #{task.id} • {task.category}
        </span>

        {confirmDelete ? (
          <div className="flex items-center gap-2 bg-red-50 px-2.5 py-1 rounded border border-red-200">
            <span className="text-xs font-medium text-red-700">Видалити?</span>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="px-2.5 py-0.5 text-xs font-semibold bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? '...' : 'Так'}
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setConfirmDelete(false)}
              className="px-2.5 py-0.5 text-xs font-medium bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 cursor-pointer"
            >
              Ні
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            <Link
              to={`/tasks/${task.id}`}
              state={{ task }}
              className="px-2.5 py-1 text-xs font-medium bg-indigo-50 border border-indigo-200 text-indigo-700 rounded hover:bg-indigo-100 transition-colors"
            >
              Деталі
            </Link>

            {isAuthenticated && (
              <>
                <button
                  type="button"
                  onClick={() => onToggleTask(task)}
                  className="px-2.5 py-1 text-xs font-medium bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {task.completed ? 'Повернути' : 'Виконано'}
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="px-2.5 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Видалити
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};