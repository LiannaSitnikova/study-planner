import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import type { Task } from '../types/task';
import type { TaskFormData } from '../schemas/taskSchema';
import { taskRepository } from '../repositories/taskRepository';
import { normalizeApiError } from '../api/httpClient';
import { useAuth } from '../context/AuthContext';
import { TaskFormDialog } from '../components/TaskFormDialog';

export const TaskDetailsPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const passedTask = (location.state as { task?: Task } | null)?.task;
  const numericId = Number(taskId);

  const [task, setTask] = useState<Task | null>(passedTask ?? null);
  const [isLoading, setIsLoading] = useState(!passedTask);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!numericId || Number.isNaN(numericId)) {
      setError('Некоректний ID завдання');
      setIsLoading(false);
      return;
    }

    if (numericId > 254 && passedTask) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    taskRepository
      .getById(
        numericId,
        passedTask
          ? {
              description: passedTask.description,
              priority: passedTask.priority,
              category: passedTask.category,
              createdBy: passedTask.createdBy,
              createdAt: passedTask.createdAt,
            }
          : undefined,
        controller.signal
      )
      .then((fresh) => {
        setTask((prev) =>
          prev
            ? {
                ...fresh,
                title: prev.title,
                completed: prev.completed,
              }
            : fresh
        );
        setError(null);
      })
      .catch((err) => {
        const normalized = normalizeApiError(err);
        if (!normalized.isAborted) {
          setError(normalized.message);
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [numericId, passedTask]);

  const handleEditClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (data: TaskFormData) => {
    if (!task) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const updated = await taskRepository.update(task.id, {
      ...task,
      title: data.title,
      description: data.description ?? '',
      category: data.category,
      priority: data.priority,
    });

    setTask(updated);
    setSuccessMsg('Зміни успішно збережено!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDelete = async () => {
    if (!task) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await taskRepository.delete(task.id);
      navigate('/tasks');
    } catch (err) {
      setError(normalizeApiError(err).message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-4">
        <Link
          to="/tasks"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Назад до списку завдань
        </Link>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
          {successMsg}
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center">
          <div className="inline-block w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-sm text-gray-600">Завантаження деталей...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          Помилка: {error}
        </div>
      ) : task ? (
        <div>
          <div className="flex flex-wrap justify-between items-start gap-3 border-b border-gray-200 pb-4 mb-4">
            <div>
              <span className="text-xs font-medium text-gray-400">
                Завдання #{task.id}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mt-0.5">{task.title}</h1>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleEditClick}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                {isAuthenticated ? 'Редагувати' : 'Увійти для редагування'}
              </button>

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                >
                  Видалити
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs text-gray-500 block mb-1">Опис:</span>
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {task.description || 'Опис відсутній'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-xs text-gray-500 block">Категорія</span>
                <span className="font-semibold text-gray-800">{task.category}</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-xs text-gray-500 block">Пріоритет</span>
                <span className="font-semibold capitalize text-gray-800">{task.priority}</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-xs text-gray-500 block">Стан виконання</span>
                <span
                  className={`font-semibold ${
                    task.completed ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {task.completed ? 'Виконано' : 'Активне'}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-xs text-gray-500 block">Створив (client-owned)</span>
                <span className="font-semibold text-gray-800">{task.createdBy}</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-xs text-gray-500 block">Дата створення (client-owned)</span>
                <span className="font-semibold text-gray-800">{task.createdAt}</span>
              </div>
            </div>
          </div>

          <TaskFormDialog
            open={isEditOpen}
            mode="edit"
            task={task}
            onClose={() => setIsEditOpen(false)}
            onSubmit={handleEditSubmit}
          />
        </div>
      ) : null}
    </div>
  );
};