import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import type { FilterPriority, FilterStatus, Task, ToastMessage } from '../types/task';
import type { TaskFormData } from '../schemas/taskSchema';
import { taskRepository } from '../repositories/taskRepository';
import { normalizeApiError } from '../api/httpClient';
import { useAuth } from '../context/AuthContext';
import { TaskStats } from '../components/TaskStats';
import { TaskFilters } from '../components/TaskFilters';
import { TaskList } from '../components/TaskList';
import { Pagination } from '../components/Pagination';
import { TaskFormDialog } from '../components/TaskFormDialog';
import { ToastContainer } from '../components/ToastContainer';

const PAGE_LIMIT = 10;

export const TasksPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const statusFilter = (searchParams.get('status') as FilterStatus) || 'all';
  const priorityFilter = (searchParams.get('priority') as FilterPriority) || 'all';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState('');
  const [reloadCount, setReloadCount] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const requestKey = `${page}-${reloadCount}`;
  const isLoading = settledKey !== requestKey;

  const showToast = useCallback((text: string, type: ToastMessage['type'] = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const skip = (page - 1) * PAGE_LIMIT;
    const currentKey = `${page}-${reloadCount}`;

    taskRepository
      .getAll(PAGE_LIMIT, skip, controller.signal)
      .then((result) => {
        setTasks(result.tasks);
        setTotalTasks(result.total);
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
  }, [page, reloadCount]);

  const updateQueryParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || (key === 'page' && value === '1')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && t.completed) ||
      (statusFilter === 'active' && !t.completed);
    const matchesPriority =
      priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const completedOnPage = tasks.filter((t) => t.completed).length;
  const activeOnPage = tasks.length - completedOnPage;
  const totalPages = Math.max(1, Math.ceil(totalTasks / PAGE_LIMIT));

  const handleOpenCreate = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsCreateOpen(true);
  };

  const handleCreateTask = async (data: TaskFormData) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const created = await taskRepository.create({
      title: data.title,
      description: data.description ?? '',
      category: data.category,
      priority: data.priority,
    });
    setTasks((prev) => [created, ...prev]);
    setTotalTasks((prev) => prev + 1);
    showToast(`Завдання «${created.title}» створено`, 'success');
  };

  const handleToggleTask = async (task: Task) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const nextCompleted = !task.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t))
    );
    try {
      await taskRepository.toggleCompleted(task.id, nextCompleted, task);
    } catch (err) {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: task.completed } : t))
      );
      showToast(`Помилка: ${normalizeApiError(err).message}`, 'error');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await taskRepository.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setTotalTasks((prev) => Math.max(0, prev - 1));
      showToast('Завдання видалено', 'info');
    } catch (err) {
      showToast(`Помилка видалення: ${normalizeApiError(err).message}`, 'error');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Список завдань</h1>
          <p className="text-sm text-gray-500">
            {isAuthenticated
              ? 'Ви авторизовані — доступні створення, редагування та видалення'
              : 'Гостьовий режим — увійдіть для керування завданнями'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          title={isAuthenticated ? 'Створити завдання' : 'Увійдіть, щоб створити завдання'}
          className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
        >
          + Додати
        </button>
      </div>

      <TaskStats
        totalOnServer={totalTasks}
        pageCount={tasks.length}
        completedOnPage={completedOnPage}
        activeOnPage={activeOnPage}
      />

      <TaskFilters
        currentStatus={statusFilter}
        currentPriority={priorityFilter}
        onStatusChange={(val) => updateQueryParam('status', val)}
        onPriorityChange={(val) => updateQueryParam('priority', val)}
        onRefresh={() => setReloadCount((c) => c + 1)}
        isLoading={isLoading}
      />

      <TaskList
        tasks={filteredTasks}
        isLoading={isLoading}
        error={error}
        isAuthenticated={isAuthenticated}
        onRetry={() => setReloadCount((c) => c + 1)}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={(newPage) => updateQueryParam('page', String(newPage))}
      />

      <TaskFormDialog
        open={isCreateOpen}
        mode="create"
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateTask}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};