import type { FilterStatus } from '../types/task';

interface TaskFiltersProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
}

export const TaskFilters = ({ currentFilter, onFilterChange }: TaskFiltersProps) => {
  const filters: { label: string; value: FilterStatus }[] = [
    { label: 'Всі', value: 'all' },
    { label: 'Виконані', value: 'completed' },
    { label: 'Не виконані', value: 'active' },
  ];

  return (
    <div className="flex gap-2 mb-6">
      {filters.map((f) => {
        const isActive = currentFilter === f.value;
        return (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
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
  );
};