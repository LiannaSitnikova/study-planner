import type { FilterStatus } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';

export const TaskFilters = () => {
  const {
    filter,
    setFilter,
    lastDeletedTask,
    restoreLastDeleted,
    resetTasks,
  } = useTaskContext();

  const filters: { label: string; value: FilterStatus }[] = [
    { label: 'Всі', value: 'all' },
    { label: 'Виконані', value: 'completed' },
    { label: 'Не виконані', value: 'active' },
  ];

  return (
    <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
      <div className="flex gap-2">
        {filters.map((f) => {
          const isActive = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {lastDeletedTask && (
          <button
            type="button"
            onClick={restoreLastDeleted}
            title={`Відновити: ${lastDeletedTask.title}`}
            className="px-3 py-2 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            ↺ Відновити видалену
          </button>
        )}

        <button
          type="button"
          onClick={resetTasks}
          className="px-3 py-2 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Скинути дані
        </button>
      </div>
    </div>
  );
};