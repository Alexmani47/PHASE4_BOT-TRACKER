import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Bots() {
  const [bots, setBots] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/bots', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setBots(data))
      .catch(() => toast.error('Failed to load bots'));
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bot?')) return;
    const res = await fetch(`http://localhost:5000/bots/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (res.ok) {
      setBots(bots.filter(b => b.id !== id));
      toast.success('Bot deleted');
    } else {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (bot) => {
    setEditingId(bot.id);
    setForm({ name: bot.name, description: bot.description });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/bots/${editingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const updated = await res.json();
      setBots(bots.map(b => (b.id === editingId ? updated : b)));
      setEditingId(null);
      setForm({ name: '', description: '' });
      toast.success('Bot updated');
    } else {
      toast.error('Update failed');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/bots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const newBot = await res.json();
      setBots([...bots, newBot]);
      setForm({ name: '', description: '' });
      setDrawerOpen(false);
      toast.success('Bot created');
    } else {
      toast.error('Failed to create bot');
    }
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Bots</h2>
        <button
          onClick={() => setDrawerOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + New Bot
        </button>
      </div>

      <ul>
        {bots.map(bot => (
          <li key={bot.id} className="mb-3">
            {editingId === bot.id ? (
              <form onSubmit={handleUpdate} className="flex gap-2">
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Bot name"
                  required
                  className="border px-2"
                />
                <input
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Description"
                  required
                  className="border px-2"
                />
                <button className="bg-blue-500 px-3 text-white">Save</button>
                <button onClick={() => setEditingId(null)} type="button" className="text-gray-500">Cancel</button>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <strong>{bot.name}</strong> - {bot.description}
                </div>
                <div>
                  <button onClick={() => handleEdit(bot)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(bot.id)} className="text-red-600">Delete</button>
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
          <h3 className="text-lg font-semibold">Add New Bot</h3>
          <button onClick={() => setDrawerOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleCreate} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Save Bot
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

export default Bots;
