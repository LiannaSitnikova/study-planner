import type { Task } from '../types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  hasAnyTasks: boolean;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

export const TaskList = ({ tasks, hasAnyTasks, onToggleTask, onDeleteTask }: TaskListProps) => {
  if (!hasAnyTasks) {
    return (
      <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 font-medium">Завдань поки немає.</p>
        <p className="text-gray-400 text-sm mt-1">Додайте перше навчальне завдання вище.</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 font-medium">За цим фільтром завдань немає.</p>
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
};