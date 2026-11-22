import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export const AppLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b border-gray-200 shadow-xs">
        <div className="max-w-3xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-3">
          <div>
            <NavLink to="/tasks" className="text-xl font-bold text-gray-800">
              Study Planner
            </NavLink>
            <p className="text-xs text-gray-500">React Router 8 • Data Mode</p>
          </div>

          <nav className="flex items-center gap-2">
            <NavLink to="/tasks" className={navLinkClass}>
              Tasks
            </NavLink>

            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                <span className="text-xs font-medium text-gray-600 hidden sm:inline">
                  @{user?.username}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm font-medium bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto py-8 px-4">
        <Outlet />
      </main>
    </div>
  );
};