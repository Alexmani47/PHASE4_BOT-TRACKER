import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Strategies() {
  const [strategies, setStrategies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', details: '' });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/strategies', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(setStrategies)
      .catch(() => toast.error('Failed to load strategies'));
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this strategy?')) return;
    const res = await fetch(`http://localhost:5000/strategies/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (res.ok) {
      setStrategies(strategies.filter(s => s.id !== id));
      toast.success('Strategy deleted');
    } else {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (strategy) => {
    setEditingId(strategy.id);
    setForm({ name: strategy.name, details: strategy.details });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/strategies/${editingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const updated = await res.json();
      setStrategies(strategies.map(s => (s.id === editingId ? updated : s)));
      setEditingId(null);
      setForm({ name: '', details: '' });
      toast.success('Strategy updated');
    } else {
      toast.error('Update failed');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/strategies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const newStrategy = await res.json();
      setStrategies([...strategies, newStrategy]);
      setForm({ name: '', details: '' });
      setDrawerOpen(false);
      toast.success('Strategy added');
    } else {
      toast.error('Failed to add strategy');
    }
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Strategies</h2>
        <button
          onClick={() => setDrawerOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + New Strategy
        </button>
      </div>

      <ul>
        {strategies.map(strategy => (
          <li key={strategy.id} className="mb-3">
            {editingId === strategy.id ? (
              <form onSubmit={handleUpdate} className="flex gap-2">
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Name"
                  className="border px-2"
                  required
                />
                <input
                  value={form.details}
                  onChange={e => setForm({ ...form, details: e.target.value })}
                  placeholder="Details"
                  className="border px-2"
                  required
                />
                <button className="bg-blue-500 px-3 text-white">Save</button>
                <button onClick={() => setEditingId(null)} type="button" className="text-gray-500">Cancel</button>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <strong>{strategy.name}</strong> - {strategy.details}
                </div>
                <div>
                  <button onClick={() => handleEdit(strategy)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(strategy.id)} className="text-red-600">Delete</button>
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
          <h3 className="text-lg font-semibold">Add New Strategy</h3>
          <button onClick={() => setDrawerOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleCreate} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Details</label>
            <input
              value={form.details}
              onChange={e => setForm({ ...form, details: e.target.value })}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Save Strategy
          </button>
        </form>
      </div>

      {/* Background  */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
}

export default Strategies;
