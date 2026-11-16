import { useState, type FormEvent } from 'react';
import type { Priority, Task } from '../types/task';

interface TaskFormProps {
  editingTask: Task | null;
  onAddTask: (taskData: Omit<Task, 'id' | 'completed'>) => Promise<boolean>;
  onUpdateTask: (task: Task) => Promise<boolean>;
  onCancelEdit: () => void;
}

export const TaskForm = ({
  editingTask,
  onAddTask,
  onUpdateTask,
  onCancelEdit,
}: TaskFormProps) => {
  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [description, setDescription] = useState(editingTask?.description ?? '');
  const [category, setCategory] = useState(editingTask?.category ?? 'Навчання');
  const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? 'medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (editingTask) {
        await onUpdateTask({
          ...editingTask,
          title: title.trim(),
          description: description.trim(),
          category: category.trim() || 'General',
          priority,
        });
      } else {
        const success = await onAddTask({
          title: title.trim(),
          description: description.trim(),
          category: category.trim() || 'General',
          priority,
        });

        if (success) {
          setTitle('');
          setDescription('');
          setPriority('medium');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`border rounded-lg p-4 mb-6 shadow-sm transition-colors ${
        editingTask ? 'bg-amber-50/70 border-amber-300' : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {editingTask ? 'Редагувати завдання' : 'Додати нове завдання'}
        </h3>
        {editingTask && (
          <span className="text-xs font-medium bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
            Режим редагування
          </span>
        )}
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Назва*:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Наприклад: Виконати лабу №10"
          required
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-60"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Опис (client-only metadata):
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Короткий опис завдання..."
          rows={2}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-60"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Категорія:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Пріоритет:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-60"
          >
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 text-white font-medium py-2 px-4 rounded-md transition-colors cursor-pointer disabled:opacity-60 ${
            editingTask
              ? 'bg-amber-600 hover:bg-amber-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isSubmitting
            ? 'Збереження...'
            : editingTask
            ? 'Зберегти зміни'
            : 'Додати завдання'}
        </button>

        {editingTask && (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancelEdit}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
};