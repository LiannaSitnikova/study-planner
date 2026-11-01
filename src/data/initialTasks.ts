import type { Task } from '../types/task';

export const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Полити квіти',
    description: 'Полити квіти на підвіконні в спальні та кухні',
    completed: false,
    priority: 'low',
    category: 'Дім',
  },
  {
    id: 2,
    title: 'Сходити в магазин',
    description: 'Купити молоко, хліб, яйця, свіжі овочі та фрукти',
    completed: true,
    priority: 'high',
    category: 'Покупки',
  },
  {
    id: 3,
    title: 'Прибрати в кімнаті',
    description: 'Протерти пил на робочому столі та пропилососити килим',
    completed: false,
    priority: 'medium',
    category: 'Дім',
  },
  {
    id: 4,
    title: 'Зробити лабу з React',
    description: 'Виконати завдання з лабораторної роботи 8',
    completed: true,
    priority: 'high',
    category: 'Навчання',
  },
  {
    id: 5,
    title: 'Зробити зарядку',
    description: '15 хвилин ранкової розминки та вправ для спини',
    completed: false,
    priority: 'low',
    category: 'Здоров\'я',
  },
  {
    id: 6,
    title: 'Виконати лабу з UX/UI',
    description: 'Оформити звіт та створити прототипи у figma',
    completed: false,
    priority: 'high',
    category: 'Навчання',
  },
];