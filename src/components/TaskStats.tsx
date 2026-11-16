import { useTaskContext } from '../hooks/useTaskContext';

export const TaskStats = () => {
  const { stats } = useTaskContext();

  return (
    <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-6 shadow-sm">
      <div className="text-gray-700">
        Всього: <span className="font-bold">{stats.total}</span>
      </div>
      <div className="text-green-600">
        Виконано: <span className="font-bold">{stats.completed}</span>
      </div>
      <div className="text-amber-600">
        Не виконано: <span className="font-bold">{stats.active}</span>
      </div>
    </div>
  );
};