import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api_url } from './config'; 
function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    bots: 0,
    trades: 0,
    total_profit: 0,
    recent_trades: [],
  });
  const [users, setUsers] = useState([]);
  const [allTrades, setAllTrades] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showTrades, setShowTrades] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usernameStored = localStorage.getItem('username');

    if (!token || !usernameStored) {
      navigate('/login');
      return;
    }

    setUsername(usernameStored);

    fetch(`${api_url}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setIsAdmin(data.is_admin);
      });

    fetch(`${api_url}/users/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to display dashboard data');
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

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${api_url}/users/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
      setShowUsers(true);
    } else {
      toast.error('Failed to fetch users');
    }
  };

  const promoteUser = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${api_url}/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_admin: true }),
    });
    if (res.ok) {
      toast.success('User promoted to admin');
      fetchUsers();
    } else {
      toast.error('Failed to promote user');
    }
  };

  const fetchAllTrades = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${api_url}/trades/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setAllTrades(data);
      setShowTrades(true);
    } else {
      toast.error('Failed to fetch trades');
    }
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

      {isAdmin && (
        <div className="flex gap-4 mb-6">
          <button
            onClick={fetchUsers}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View All Users
          </button>
          <button
            onClick={fetchAllTrades}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View All Trades
          </button>
        </div>
      )}

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

      {showUsers && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">All Users</h2>
          <ul>
            {users.map(user => (
              <li key={user.id} className="mb-2 flex justify-between">
                <span>{user.user_name} ({user.email})</span>
                {!user.is_admin && (
                  <button
                    onClick={() => promoteUser(user.id)}
                    className="text-sm bg-green-600 px-3 py-1 rounded text-white hover:bg-green-700"
                  >
                    Promote to Admin
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showTrades && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">All Trades</h2>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-left">Profit</th>
              </tr>
            </thead>
            <tbody>
              {allTrades.map(trade => (
                <tr key={trade.id} className="border-t border-gray-300 dark:border-gray-700">
                  <td className="px-4 py-2">{trade.user_name}</td>
                  <td className="px-4 py-2">{trade.symbol}</td>
                  <td className={`px-4 py-2 ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{trade.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
