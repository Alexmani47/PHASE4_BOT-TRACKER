import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState({
    bots: 0,
    trades: 0,
    total_profit: 0,
    recent_trades: [],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usernameStored = localStorage.getItem('username');

    if (!token || !usernameStored) {
      navigate('/login');
      return;
    }

    setUsername(usernameStored);

    fetch('http://localhost:5000/users/dashboard', {
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
          total_profit: data.total_profit || 0,
          recent_trades: data.recent_trades || [],
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
    <div className="min-h-screen flex flex-col dark bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <p className="mb-6 text-lg">
        Welcome back, <span className="font-semibold">{username}</span>!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Bots</h2>
          <p className="text-3xl font-bold">{stats.bots}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Trades</h2>
          <p className="text-3xl font-bold">{stats.trades}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Profit/Loss</h2>
          <p className={`text-3xl font-bold ${stats.total_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${stats.total_profit}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Trades</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Asset</th>
              <th className="px-4 py-2 text-left">Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent_trades.map((trade) => (
              <tr key={trade.id} className="border-t border-gray-300 dark:border-gray-700">
                <td className="px-4 py-2">{trade.date}</td>
                <td className="px-4 py-2">{trade.asset}</td>
                <td className={`px-4 py-2 ${trade.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trade.profit_loss}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
