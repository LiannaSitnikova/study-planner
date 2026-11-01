import type { Task } from '../types/task';

export const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Виконати лабу №8',
    description: 'Зробити всі завдання відповідно до методички',
    completed: true,
    priority: 'high',
    category: 'Веб-розробка',
  },
  {
    id: 2,
    title: 'Прочитати лекцію',
    description: 'Опрацювати матеріал з теми React components та useState',
    completed: true,
    priority: 'medium',
    category: 'Веб-розробка',
  },
  {
    id: 3,
    title: 'Створити макет',
    description: 'Зробити прототип головної сторінки у Figma для MoodTracker',
    completed: false,
    priority: 'high',
    category: 'UI/UX',
  },
  {
    id: 4,
    title: 'Підготувати презентацію',
    description: 'Підготувати слайди для захисту проєкту',
    completed: false,
    priority: 'low',
    category: 'Маркетинг',
  },
  {
    id: 5,
    title: 'Проаналізувати конкурентів',
    description: 'Дослідити аналоги та скласти таблицю переваг',
    completed: false,
    priority: 'medium',
    category: 'Маркетинг',
  },
  {
    id: 6,
    title: 'Створити UI кит',
    description: 'Підготувати базові компоненти кнопок та полів',
    completed: false,
    priority: 'high',
    category: 'UI/UX',
  },
];