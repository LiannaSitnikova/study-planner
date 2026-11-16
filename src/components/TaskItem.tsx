import type { Task } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';

interface TaskItemProps {
  task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
  const {
    toggleTask,
    requestDelete,
    undoDelete,
    pendingDeletions,
    editingTask,
    setEditingTask,
  } = useTaskContext();

  const isPendingDelete = pendingDeletions.some((p) => p.taskId === task.id);
  const isEditing = editingTask?.id === task.id;

  const priorityColors = {
    low: 'bg-gray-200 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div
      className={`border rounded-lg p-4 mb-3 transition-all shadow-sm ${
        isPendingDelete
          ? 'opacity-55 bg-red-50/60 border-red-300 border-l-4 border-l-red-500'
          : isEditing
          ? 'bg-amber-50/60 border-amber-400 border-l-4 border-l-amber-500'
          : task.completed
          ? 'bg-emerald-50/60 border-emerald-300 border-l-4 border-l-emerald-500'
          : 'bg-white border-gray-200 border-l-4 border-l-blue-500'
      }`}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h4
            className={`font-semibold text-lg ${
              task.completed ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          >
            {task.title}
          </h4>

          {isPendingDelete && (
            <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full animate-pulse">
              Буде видалено...
            </span>
          )}
        </div>

        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p
          className={`text-sm mb-3 ${
            task.completed ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-gray-100 mt-2">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          {task.category}
        </span>

        <div className="flex gap-2">
          {isPendingDelete ? (
            <button
              type="button"
              onClick={() => undoDelete(task.id)}
              className="px-3 py-1 text-xs font-semibold bg-amber-500 text-gray-950 rounded hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Скасувати видалення
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                className="px-3 py-1 text-xs font-medium bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {task.completed ? 'Повернути' : 'Виконано'}
              </button>

              <button
                type="button"
                onClick={() => setEditingTask(task)}
                className="px-3 py-1 text-xs font-medium bg-blue-50 border border-blue-200 text-blue-700 rounded hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Редагувати
              </button>

              <button
                type="button"
                onClick={() => requestDelete(task.id)}
                className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
              >
                Видалити
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};