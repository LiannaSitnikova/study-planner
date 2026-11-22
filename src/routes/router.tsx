import { createBrowserRouter, redirect } from 'react-router';
import { authStorage } from '../utils/authStorage';
import { AppLayout } from '../layouts/AppLayout';
import { TasksPage } from '../pages/TasksPage';
import { TaskDetailsPage } from '../pages/TaskDetailsPage';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';

function requireUser() {
  const token = authStorage.getToken();
  if (!token) {
    throw redirect('/login');
  }
  return null;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        loader: () => redirect('/tasks'),
      },
      {
        path: 'tasks',
        element: <TasksPage />,
      },
      {
        path: 'tasks/:taskId',
        element: <TaskDetailsPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'profile',
        loader: requireUser,
        element: <ProfilePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);