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
    <div className="min-h-screen flex flex-col text-white">
      <nav className="bg-black/70 shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-300">Bot Tracker</h1>
        <div className="flex gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive
                    ? 'text-indigo-300 underline'
                    : 'text-gray-300 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-300 font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <main
        className="flex-1 bg-cover bg-center min-h-screen"
        style={{
          backgroundImage:
            "url('https://blogs.debutinfotech.com/wp-content/uploads/2025/01/Crypto-AI-Quantitative-Trading-Bots.jpg')",
        }}
      >
        <div className="backdrop-blur-sm bg-black/60 min-h-screen p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
