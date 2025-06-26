import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api_url } from './config'; 
function Bots() {
  const [bots, setBots] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', platform: '', strategy: '', user_name: '' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userOptions, setUserOptions] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${api_url}/bots/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setBots(data))
      .catch(() => toast.error('Failed to load bots'));

    fetch(`${api_url}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data?.is_admin) {
          setIsAdmin(true);
          fetch(`${api_url}/users/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(res => res.json())
            .then(setUserOptions)
            .catch(() => toast.error('Failed to load users'));
        }
      })
      .catch(() => toast.error('Failed to verify user role'));
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bot?')) return;
    const res = await fetch(`${api_url}/bots/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setBots(bots.filter(b => b.id !== id));
      toast.success('Bot deleted');
    } else {
      toast.error('Failed to delete bot');
    }
  };

  const handleEdit = (bot) => {
    setEditingId(bot.id);
    setForm({ name: bot.name, platform: bot.platform || '', strategy: bot.strategy || '', user_name: bot.user_name });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${api_url}/bots/${editingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const updated = await res.json();
      setBots(bots.map(b => (b.id === editingId ? updated : b)));
      setEditingId(null);
      setForm({ name: '', platform: '', strategy: '', user_name: '' });
      toast.success('Bot updated');
    } else {
      toast.error('Update failed');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${api_url}/bots/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.status === 403) {
      toast.error('Only admins can create bots');
      return;
    }

    if (res.ok) {
      const newBot = await res.json();
      setBots([...bots, newBot]);
      setForm({ name: '', platform: '', strategy: '', user_name: '' });
      setDrawerOpen(false);
      toast.success('Bot created');
    } else {
      toast.error('Failed to create bot');
    }
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Bots</h2>
        {isAdmin && (
          <button
            onClick={() => setDrawerOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + New Bot
          </button>
        )}
      </div>

      <ul>
        {bots.map(bot => (
          <li key={bot.id} className="mb-3">
            {editingId === bot.id ? (
              <form onSubmit={handleUpdate} className="flex gap-2 flex-wrap">
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Bot name"
                  required
                  className="border px-2"
                />
                <input
                  value={form.platform}
                  onChange={e => setForm({ ...form, platform: e.target.value })}
                  placeholder="Platform"
                  className="border px-2"
                />
                <input
                  value={form.strategy}
                  onChange={e => setForm({ ...form, strategy: e.target.value })}
                  placeholder="Strategy"
                  className="border px-2"
                />
                <button className="bg-blue-500 px-3 text-white">Save</button>
                <button onClick={() => setEditingId(null)} type="button" className="text-gray-500">Cancel</button>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <strong>{bot.name}</strong> — {bot.platform || 'N/A'} ({bot.strategy || 'No strategy'})<br />
                  <span className="text-sm text-gray-400">Owned by: {bot.user_name}</span>
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

      {/* Drawer */}
      {isAdmin && (
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-blue-700 text-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-blue-300 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Add New Bot</h3>
            <button onClick={() => setDrawerOpen(false)} className="text-white hover:text-gray-200">✕</button>
          </div>
          <form onSubmit={handleCreate} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Platform</label>
              <input
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="w-full border px-3 py-2 rounded bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Strategy</label>
              <input
                value={form.strategy}
                onChange={(e) => setForm({ ...form, strategy: e.target.value })}
                className="w-full border px-3 py-2 rounded bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Assign to User</label>
              <select
                value={form.user_name}
                onChange={(e) => setForm({ ...form, user_name: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded bg-white text-black"
              >
                <option value="">Select user</option>
                {userOptions.map(user => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-white text-blue-700 font-semibold hover:bg-blue-100 py-2 rounded"
            >
              Save Bot
            </button>
          </form>
        </div>
      )}

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
