import type { FilterStatus } from '../types/task';

interface TaskFiltersProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const TaskFilters = ({
  currentFilter,
  onFilterChange,
  onRefresh,
  isLoading,
}: TaskFiltersProps) => {
  const filters: { label: string; value: FilterStatus }[] = [
    { label: 'Всі', value: 'all' },
    { label: 'Виконані', value: 'completed' },
    { label: 'Не виконані', value: 'active' },
  ];

  return (
    <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
      <div className="flex gap-2">
        {filters.map((f) => {
          const isActive = currentFilter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => onFilterChange(f.value)}
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

      <button
        type="button"
        onClick={onRefresh}
        disabled={isLoading}
        className="px-3 py-2 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
      >
        ↻ Оновити з сервера
      </button>
    </div>
  );
};