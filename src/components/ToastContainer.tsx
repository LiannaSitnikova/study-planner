import { useEffect } from 'react';
import type { ToastMessage } from '../types/task';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const ToastItem = ({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const colors = {
    success: 'border-l-emerald-500',
    info: 'border-l-blue-500',
    error: 'border-l-red-500',
  };

  return (
    <div
      className={`pointer-events-auto bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 border-l-4 ${
        colors[toast.type]
      } px-4 py-3 text-sm flex items-center justify-between gap-3 min-w-[270px] max-w-sm`}
    >
      <span>{toast.text}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-gray-400 hover:text-white cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onDismiss }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};