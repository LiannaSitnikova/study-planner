import { useEffect, useState } from 'react';
import type { Task } from '../types/task';
import { taskRepository } from '../repositories/taskRepository';
import { normalizeApiError } from '../api/httpClient';

interface TaskDetailsModalProps {
  selectedTask: Task | null;
  onClose: () => void;
}

const TaskDetailsContent = ({
  selectedTask,
  onClose,
}: {
  selectedTask: Task;
  onClose: () => void;
}) => {
  const [details, setDetails] = useState<Task | null>(
    selectedTask.id > 254 ? selectedTask : null
  );
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [settledKey, setSettledKey] = useState<string>(
    selectedTask.id > 254 ? `${selectedTask.id}-0` : ''
  );

  const requestKey = `${selectedTask.id}-${reloadTrigger}`;
  const isLoading = selectedTask.id <= 254 && settledKey !== requestKey;

  useEffect(() => {
    if (selectedTask.id > 254) return;

    const controller = new AbortController();
    const currentKey = `${selectedTask.id}-${reloadTrigger}`;

    taskRepository
      .getById(
        selectedTask.id,
        {
          description: selectedTask.description,
          priority: selectedTask.priority,
          category: selectedTask.category,
        },
        controller.signal
      )
      .then((freshTask) => {
        setDetails({
          ...freshTask,
          title: selectedTask.title,
          completed: selectedTask.completed,
        });
        setError(null);
        setSettledKey(currentKey);
      })
      .catch((err) => {
        const normalized = normalizeApiError(err);
        if (normalized.isAborted) return;
        setError(normalized.message);
        setSettledKey(currentKey);
      });

    return () => controller.abort();
  }, [selectedTask, reloadTrigger]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Деталі завдання #{selectedTask.id}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="py-8 text-center">
            <div className="inline-block w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-sm text-gray-600">Loading details...</p>
          </div>
        ) : error ? (
          <div className="py-6 text-center bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700 mb-3">Помилка завантаження: {error}</p>
            <button
              type="button"
              onClick={() => setReloadTrigger((prev) => prev + 1)}
              className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
            >
              Спробувати ще
            </button>
          </div>
        ) : details ? (
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500 block text-xs">Назва:</span>
              <p className="font-semibold text-gray-900 text-base">{details.title}</p>
            </div>

            <div>
              <span className="text-gray-500 block text-xs">Опис:</span>
              <p className="text-gray-700">{details.description || 'Опис відсутній'}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
              <div>
                <span className="text-gray-500 block text-xs">Категорія:</span>
                <span className="font-medium text-gray-800">{details.category}</span>
              </div>

              <div>
                <span className="text-gray-500 block text-xs">Пріоритет:</span>
                <span className="font-medium capitalize text-gray-800">
                  {details.priority}
                </span>
              </div>

              <div>
                <span className="text-gray-500 block text-xs">Статус:</span>
                <span
                  className={`font-semibold ${
                    details.completed ? 'text-green-600' : 'text-amber-600'
                  }`}
                >
                  {details.completed ? 'Виконано' : 'Активне'}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};

export const TaskDetailsModal = ({ selectedTask, onClose }: TaskDetailsModalProps) => {
  if (!selectedTask) return null;

  return (
    <TaskDetailsContent
      key={selectedTask.id}
      selectedTask={selectedTask}
      onClose={onClose}
    />
  );
};