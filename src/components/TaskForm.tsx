import { useState, type FormEvent } from 'react';
import type { Priority, Task } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';

interface TaskFormContentProps {
  editingTask: Task | null;
  onAddTask: (taskData: Omit<Task, 'id' | 'completed'>) => void;
  onUpdateTask: (task: Task) => void;
  onCancelEdit: () => void;
}

const TaskFormContent = ({
  editingTask,
  onAddTask,
  onUpdateTask,
  onCancelEdit,
}: TaskFormContentProps) => {
  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [description, setDescription] = useState(editingTask?.description ?? '');
  const [category, setCategory] = useState(editingTask?.category ?? 'Навчання');
  const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? 'medium');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || 'Загальне',
        priority,
      });
    } else {
      onAddTask({
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || 'Загальне',
        priority,
      });

      setTitle('');
      setDescription('');
      setPriority('medium');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`border rounded-lg p-4 mb-6 shadow-sm transition-colors ${
        editingTask
          ? 'bg-amber-50/70 border-amber-300'
          : 'bg-gray-50 border-gray-200'
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
          placeholder="Наприклад: Виконати лабу №9"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Опис:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Короткий опис завдання..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Категорія:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Пріоритет:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
          className={`flex-1 text-white font-medium py-2 px-4 rounded-md transition-colors cursor-pointer ${
            editingTask
              ? 'bg-amber-600 hover:bg-amber-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {editingTask ? 'Зберегти зміни' : 'Додати завдання'}
        </button>

        {editingTask && (
          <button
            type="button"
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

export const TaskForm = () => {
  const { addTask, updateTask, editingTask, setEditingTask } = useTaskContext();

  return (
    <TaskFormContent
      key={editingTask?.id ?? 'create'}
      editingTask={editingTask}
      onAddTask={addTask}
      onUpdateTask={updateTask}
      onCancelEdit={() => setEditingTask(null)}
    />
  );
};