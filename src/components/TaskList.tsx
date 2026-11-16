import { useTaskContext } from '../hooks/useTaskContext';
import { TaskItem } from './TaskItem';

export const TaskList = () => {
  const { tasks, filteredTasks } = useTaskContext();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 font-medium">Завдань поки немає.</p>
        <p className="text-gray-400 text-sm mt-1">Додайте перше навчальне завдання вище.</p>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 font-medium">За цим фільтром завдань немає.</p>
      </div>
    );
  }

  return (
    <div>
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};