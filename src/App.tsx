import { useState, useEffect, useCallback } from 'react';
import type { FilterStatus, Task, ToastMessage } from './types/task';
import { taskRepository } from './repositories/taskRepository';
import { normalizeApiError } from './api/httpClient';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { Pagination } from './components/Pagination';
import { TaskDetailsModal } from './components/TaskDetailsModal';
import { ToastContainer } from './components/ToastContainer';

const PAGE_LIMIT = 10;

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState('');

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useLocalStorage<FilterStatus>('study-planner-filter', 'all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [reloadCount, setReloadCount] = useState(0);

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

   const filteredTasks = tasks.filter((t) => {
    if (filter === 'completed') return t.completed;
    if (filter === 'active') return !t.completed;
    return true;
  });

  const completedOnPage = tasks.filter((t) => t.completed).length;
  const activeOnPage = tasks.length - completedOnPage;
  const totalPages = Math.max(1, Math.ceil(totalTasks / PAGE_LIMIT));

  useEffect(() => {
    document.title = `Study Planner • Page ${page}`;
  }, [page]);

  const handleAddTask = async (newTaskData: Omit<Task, 'id' | 'completed'>): Promise<boolean> => {
    try {
      const created = await taskRepository.create(newTaskData);
      setTasks((prev) => [created, ...prev]);
      setTotalTasks((prev) => prev + 1);
      showToast(`Завдання «${created.title}» створено`, 'success');
      return true;
    } catch (err) {
      showToast(normalizeApiError(err).message, 'error');
      return false;
    }
  };

  const handleUpdateTask = async (updatedTask: Task): Promise<boolean> => {
    try {
      const saved = await taskRepository.update(updatedTask.id, updatedTask);
      setTasks((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
      setEditingTask(null);
      showToast(`Завдання «${saved.title}» оновлено`, 'success');
      return true;
    } catch (err) {
      showToast(normalizeApiError(err).message, 'error');
      return false;
    }
  };

    const handleToggleTask = async (task: Task) => {
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
      showToast(`Не вдалося оновити статус: ${normalizeApiError(err).message}`, 'error');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await taskRepository.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setTotalTasks((prev) => Math.max(0, prev - 1));
      if (editingTask?.id === id) setEditingTask(null);
      if (selectedTask?.id === id) setSelectedTask(null);
      showToast('Завдання видалено', 'info');
    } catch (err) {
      showToast(`Помилка видалення: ${normalizeApiError(err).message}`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <Header />

        <TaskForm
          key={editingTask?.id ?? 'create'}
          editingTask={editingTask}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onCancelEdit={() => setEditingTask(null)}
        />

        <TaskStats
          totalOnServer={totalTasks}
          pageCount={tasks.length}
          completedOnPage={completedOnPage}
          activeOnPage={activeOnPage}
        />

        <TaskFilters
          currentFilter={filter}
          onFilterChange={setFilter}
          onRefresh={() => setReloadCount((c) => c + 1)}
          isLoading={isLoading}
        />

        <TaskList
          tasks={filteredTasks}
          isLoading={isLoading}
          error={error}
          editingTaskId={editingTask?.id ?? null}
          onRetry={() => setReloadCount((c) => c + 1)}
          onSelectDetails={setSelectedTask}
          onToggleTask={handleToggleTask}
          onEditTask={setEditingTask}
          onDeleteTask={handleDeleteTask}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          isLoading={isLoading}
          onPageChange={setPage}
        />
      </div>

      <TaskDetailsModal
        selectedTask={selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;