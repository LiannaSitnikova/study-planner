import { useEffect, useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import type { ToastMessage } from '../types/task';

interface ToastCardProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
  onUndo?: (taskId: number) => void;
}

const ToastCard = ({ toast, onDismiss, onUndo }: ToastCardProps) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (toast.undoTaskId !== undefined) return; 
    const duration = toast.duration ?? 3000;
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);


  useEffect(() => {
    if (!toast.expiresAt || !toast.duration) return;

    const total = toast.duration;
    const expiresAt = toast.expiresAt;

    const interval = setInterval(() => {
      const remaining = Math.max(0, expiresAt - Date.now());
      setProgress((remaining / total) * 100);
    }, 50);

    return () => clearInterval(interval);
  }, [toast.expiresAt, toast.duration]);

  const borderColors = {
    success: 'border-l-emerald-500',
    info: 'border-l-blue-500',
    warning: 'border-l-amber-500',
    error: 'border-l-red-500',
  };

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 border-l-4 ${
        borderColors[toast.type]
      } p-3.5 min-w-[290px] max-w-sm transition-all`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium leading-snug">{toast.text}</p>

        <div className="flex items-center gap-2 shrink-0">
          {toast.undoTaskId !== undefined && onUndo && (
            <button
              type="button"
              onClick={() => onUndo(toast.undoTaskId!)}
              className="px-2.5 py-1 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-gray-950 rounded transition-colors cursor-pointer"
            >
              Скасувати
            </button>
          )}
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Закрити сповіщення"
            className="text-gray-400 hover:text-white text-sm px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      {toast.undoTaskId !== undefined && (
        <div className="mt-2.5 h-1 w-full bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, dismissToast, undoDelete } = useTaskContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          onDismiss={dismissToast}
          onUndo={undoDelete}
        />
      ))}
    </div>
  );
};