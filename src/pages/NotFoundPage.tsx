import { Link } from 'react-router';

export const NotFoundPage = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center">
      <p className="text-5xl font-bold text-blue-600 mb-2">404</p>
      <h1 className="text-xl font-bold text-gray-800 mb-2">Сторінку не знайдено</h1>
      <p className="text-sm text-gray-500 mb-6">
        Маршрут, який ви відкрили, не існує.
      </p>
      <Link
        to="/tasks"
        className="inline-block px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Повернутися до завдань
      </Link>
    </div>
  );
};