import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

export const TaskItem = ({ task, onToggleTask, onDeleteTask }: TaskItemProps) => {
  const priorityColors = {
    low: 'bg-gray-200 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div
      className={`border rounded-lg p-4 mb-3 transition-all shadow-sm ${
        task.completed
          ? 'bg-emerald-50/60 border-emerald-300 border-l-4 border-l-emerald-500'
          : 'bg-white border-gray-200 border-l-4 border-l-blue-500'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4
          className={`font-semibold text-lg ${
            task.completed ? 'line-through text-gray-400' : 'text-gray-800'
          }`}
        >
          {task.title}
        </h4>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
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

      <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          {task.category}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => onToggleTask(task.id)}
            className="px-3 py-1 text-xs font-medium bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            {task.completed ? 'Повернути' : 'Виконано'}
          </button>

          <button
            onClick={() => onDeleteTask(task.id)}
            className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
};