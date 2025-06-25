import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/bots', label: 'Bots' },
    { path: '/trades', label: 'Trades' },
  ];

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white">
      <nav className="bg-white dark:bg-gray-800 shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-300">
          Bot Tracker
        </h1>
        <div className="flex gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-300'
                } hover:text-indigo-800 dark:hover:text-indigo-100`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 transition-all">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
