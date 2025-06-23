import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState({
    bots: 0,
    trades: 0,
    strategies: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usernameStored = localStorage.getItem('username');

    if (!token || !usernameStored) {
      navigate('/login');
      return;
    }

    setUsername(usernameStored);

    fetch('http://localhost:5000/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch dashboard data');
        }
        return res.json();
      })
      .then((data) => {
        setStats({
          bots: data.bots_count || 0,
          trades: data.trades_count || 0,
          strategies: data.strategies_count || 0,
        });
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <p className="mb-6 text-lg">Welcome back, <span className="font-semibold">{username}</span>!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Bots</h2>
          <p className="text-3xl font-bold">{stats.bots}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Trades</h2>
          <p className="text-3xl font-bold">{stats.trades}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Strategies</h2>
          <p className="text-3xl font-bold">{stats.strategies}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
