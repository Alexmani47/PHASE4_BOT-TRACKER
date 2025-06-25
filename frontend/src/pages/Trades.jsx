import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Trades() {
  const [trades, setTrades] = useState([]);
  const [bots, setBots] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    date: '',
    asset: '',
    profit_loss: '',
    bot_name: ''
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Load trades
    fetch('http://localhost:5000/trades/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setTrades)
      .catch(() => toast.error('Failed to load trades'));

    // Load bots for dropdown
    fetch('http://localhost:5000/bots/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setBots)
      .catch(() => toast.error('Failed to load bots'));
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this trade?')) return;
    const res = await fetch(`http://localhost:5000/trades/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setTrades(trades.filter(t => t.id !== id));
      toast.success('Trade deleted');
    } else {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (trade) => {
    setEditingId(trade.id);
    setForm({
      date: trade.date,
      asset: trade.asset,
      profit_loss: trade.profit_loss,
      bot_name: trade.bot_name
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/trades/${editingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const updated = await res.json();
      setTrades(trades.map(t => (t.id === editingId ? updated : t)));
      setEditingId(null);
      setForm({ date: '', asset: '', profit_loss: '', bot_name: '' });
      toast.success('Trade updated');
    } else {
      toast.error('Update failed');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/trades/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const newTrade = await res.json();
      setTrades([...trades, newTrade]);
      setForm({ date: '', asset: '', profit_loss: '', bot_name: '' });
      setDrawerOpen(false);
      toast.success('Trade added');
    } else {
      toast.error('Failed to add trade');
    }
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Trade History</h2>
        <button
          onClick={() => setDrawerOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + New Trade
        </button>
      </div>

      <table className="w-full table-auto bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-blue-700 text-white">
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Asset</th>
            <th className="px-4 py-2 text-left">Profit/Loss</th>
            <th className="px-4 py-2 text-left">Bot</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {trades.map(trade => (
            <tr key={trade.id} className="bg-gray-800 text-white border-t border-gray-700">
              {editingId === trade.id ? (
                <>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      placeholder="MM/DD/YYYY"
                      className="border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={form.asset}
                      onChange={e => setForm({ ...form, asset: e.target.value })}
                      className="border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={form.profit_loss}
                      onChange={e => setForm({ ...form, profit_loss: e.target.value })}
                      className="border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={form.bot_name}
                      onChange={e => setForm({ ...form, bot_name: e.target.value })}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">Select Bot</option>
                      {bots.map(bot => (
                        <option key={bot.id} value={bot.name}>
                          {bot.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button onClick={handleUpdate} className="text-blue-600 mr-2">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-gray-500">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-2">{trade.date}</td>
                  <td className="px-4 py-2">{trade.asset}</td>
                  <td className={`px-4 py-2 ${trade.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${trade.profit_loss}
                  </td>
                  <td className="px-4 py-2">{trade.bot_name}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleEdit(trade)} className="text-blue-600 mr-2">Edit</button>
                    <button onClick={() => handleDelete(trade.id)} className="text-red-600">Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-blue-700 text-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-blue-300 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Add New Trade</h3>
          <button onClick={() => setDrawerOpen(false)} className="text-white hover:text-gray-200">✕</button>
        </div>
        <form onSubmit={handleCreate} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">Date (MM/DD/YYYY)</label>
            <input
              type="text"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Asset</label>
            <input
              type="text"
              value={form.asset}
              onChange={e => setForm({ ...form, asset: e.target.value })}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Profit/Loss</label>
            <input
              type="number"
              value={form.profit_loss}
              onChange={e => setForm({ ...form, profit_loss: e.target.value })}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Bot</label>
            <select
              value={form.bot_name}
              onChange={e => setForm({ ...form, bot_name: e.target.value })}
              required
                  className="w-full border px-3 py-2 rounded bg-white text-black"


            >
              <option value="">Select Bot</option>
              {bots.map(bot => (
                <option key={bot.id} value={bot.name}>
                  {bot.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-white text-blue-700 font-semibold hover:bg-blue-100 py-2 rounded"
          >
            Save Trade
          </button>
        </form>
      </div>

      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
}

export default Trades;
