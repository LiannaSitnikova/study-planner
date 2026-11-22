import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Профіль користувача</h1>

      <div className="space-y-3 text-sm mb-6">
        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="text-xs text-gray-500 block">Статус авторизації</span>
          <span className="font-semibold text-emerald-600">
            {isAuthenticated ? 'Авторизований (Active Session)' : 'Не авторизований'}
          </span>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="text-xs text-gray-500 block">Username</span>
          <span className="font-semibold text-gray-900">
            @{user?.username ?? '—'}
          </span>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="text-xs text-gray-500 block">Email</span>
          <span className="font-semibold text-gray-900">
            {user?.email ?? '—'}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};