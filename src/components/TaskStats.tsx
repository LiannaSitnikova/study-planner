interface TaskStatsProps {
  total: number;
  completed: number;
  active: number;
}

export const TaskStats = ({ total, completed, active }: TaskStatsProps) => {
  return (
    <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-6 shadow-sm">
      <div className="text-gray-700">Всього: <span className="font-bold">{total}</span></div>
      <div className="text-green-600">Виконано: <span className="font-bold">{completed}</span></div>
      <div className="text-amber-600">Не виконано: <span className="font-bold">{active}</span></div>
    </div>
  );
};