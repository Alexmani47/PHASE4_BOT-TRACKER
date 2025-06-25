import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Trades() {
  const [trades, setTrades] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ symbol: '', profit: '' });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/trades/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(setTrades)
      .catch(() => toast.error('Failed to load trades'));
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
    setForm({ symbol: trade.symbol, profit: trade.profit });
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
      setForm({ symbol: '', profit: '' });
      toast.success('Trade updated');
    } else {
      toast.error('Update failed');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/trades', {
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
      setForm({ symbol: '', profit: '' });
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

      <ul>
        {trades.map(trade => (
          <li key={trade.id} className="mb-3">
            {editingId === trade.id ? (
              <form onSubmit={handleUpdate} className="flex gap-2">
                <input
                  value={form.symbol}
                  onChange={e => setForm({ ...form, symbol: e.target.value })}
                  placeholder="Symbol"
                  className="border px-2"
                  required
                />
                <input
                  value={form.profit}
                  onChange={e => setForm({ ...form, profit: e.target.value })}
                  placeholder="Profit"
                  className="border px-2"
                  required
                />
                <button className="bg-blue-500 px-3 text-white">Save</button>
                <button onClick={() => setEditingId(null)} type="button" className="text-gray-500">Cancel</button>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <div>{trade.symbol} - ${trade.profit}</div>
                <div>
                  <button onClick={() => handleEdit(trade)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(trade.id)} className="text-red-600">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Add New Trade</h3>
          <button onClick={() => setDrawerOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleCreate} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Symbol</label>
            <input
              value={form.symbol}
              onChange={e => setForm({ ...form, symbol: e.target.value })}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profit</label>
            <input
              value={form.profit}
              onChange={e => setForm({ ...form, profit: e.target.value })}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Save Trade
          </button>
        </form>
      </div>

      {/* Background overlay */}
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
