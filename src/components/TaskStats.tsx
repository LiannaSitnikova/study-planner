interface TaskStatsProps {
  totalOnServer: number;
  pageCount: number;
  completedOnPage: number;
  activeOnPage: number;
}

export const TaskStats = ({
  totalOnServer,
  pageCount,
  completedOnPage,
  activeOnPage,
}: TaskStatsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-100 p-4 rounded-lg mb-6 shadow-sm text-sm">
      <div className="text-gray-700">
        Усього в API: <span className="font-bold">{totalOnServer}</span>
      </div>
      <div className="text-gray-700">
        На сторінці: <span className="font-bold">{pageCount}</span>
      </div>
      <div className="text-green-600">
        Виконано: <span className="font-bold">{completedOnPage}</span>
      </div>
      <div className="text-amber-600">
        Активні: <span className="font-bold">{activeOnPage}</span>
      </div>
    </div>
  );
};