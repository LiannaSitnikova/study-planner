import type { FilterPriority, FilterStatus } from '../types/task';

interface TaskFiltersProps {
  currentStatus: FilterStatus;
  currentPriority: FilterPriority;
  onStatusChange: (status: FilterStatus) => void;
  onPriorityChange: (priority: FilterPriority) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const TaskFilters = ({
  currentStatus,
  currentPriority,
  onStatusChange,
  onPriorityChange,
  onRefresh,
  isLoading,
}: TaskFiltersProps) => {
  const statuses: { label: string; value: FilterStatus }[] = [
    { label: 'Всі', value: 'all' },
    { label: 'Виконані', value: 'completed' },
    { label: 'Активні', value: 'active' },
  ];

  return (
    <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1.5">
          {statuses.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onStatusChange(s.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                currentStatus === s.value
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <select
          aria-label="Фільтр за пріоритетом"
          value={currentPriority}
          onChange={(e) => onPriorityChange(e.target.value as FilterPriority)}
          className="px-3 py-1.5 text-sm bg-white text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Усі пріоритети</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isLoading}
        className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer disabled:opacity-50"
      >
        ↻ Оновити
      </button>
    </div>
  );
};