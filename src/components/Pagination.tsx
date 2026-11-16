interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
      <button
        type="button"
        disabled={currentPage <= 1 || isLoading}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        ← Попередня
      </button>

      <span className="text-sm font-medium text-gray-700">
        Сторінка <span className="font-bold">{currentPage}</span> з{' '}
        <span className="font-bold">{totalPages}</span>
      </span>

      <button
        type="button"
        disabled={currentPage >= totalPages || isLoading}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Наступна →
      </button>
    </div>
  );
};